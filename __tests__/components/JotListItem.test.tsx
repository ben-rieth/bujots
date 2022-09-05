import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import JotListItem from 'components/JotListItem';
import { Jot, Type, Status } from '@prisma/client';

const server = setupServer(
    rest.patch('/api/jots/id', (req, res, ctx) => {
        return res(
            ctx.status(200)
        )
    })
);

beforeAll(() => server.listen());

afterAll(() => server.close());
afterEach(() => server.resetHandlers())

describe("Testing Jot Component", () => {

    const testJot : Jot = {
        id: 'id',
        content: 'This is a jot',
        status: Status.ACTIVE,
        type: Type.NOTE,
        important: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        listId: 'listId'
    }

    it('displays the text content of the jot', () => {
        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>);

        const content = screen.getByText('This is a jot');

        expect(content).toBeInTheDocument();
    });

    it('displays a dash if the jot is a NOTE', () => {
        testJot.type = Type.NOTE;

        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>);

        const icon = screen.getByTestId('dash');
        expect(icon).toBeInTheDocument();

    });

    it('displays a triangle if the jot is an EVENT', () => {
        testJot.type = Type.EVENT;

        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>)

        const icon = screen.getByTestId('triangle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('displays a circle if the jot is a TASK', () => {
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>)

        const icon = screen.getByTestId('circle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('display the edit form when clicked on', async () => {
        const user = userEvent.setup();

        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>)

        const content = screen.getByTestId('content');

        await user.click(content);

        const form = screen.getByRole('form');
        expect(form).toBeInTheDocument();
        expect(content).not.toBeInTheDocument();
    });

    it('when task or event icon is clicked, task becomes completed', async () => {
        const user = userEvent.setup();
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={true} onMigrate={jest.fn()}/>);

        const taskIcon = screen.getByTestId('circle-outline');
        expect(taskIcon).toBeInTheDocument();

        await user.click(taskIcon);
        await screen.findByTestId('circle-filled')

    });

    it('does not let user complete item if date is not today', async () => {
        const user = userEvent.setup();
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={false} onMigrate={jest.fn()}/>)

        const taskIcon = screen.getByTestId('circle-outline');
        expect(taskIcon).toBeInTheDocument();

        await user.click(taskIcon);

        expect(taskIcon).toBeInTheDocument();

        const filledIcon = screen.queryByTestId('circle-filled');

        expect(filledIcon).not.toBeInTheDocument();
    });

    it('does not open edit form if date is not today', async () => {
        const user = userEvent.setup();
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={false} onMigrate={jest.fn()}/>)

        const content = screen.getByTestId('content');

        await user.click(content);

        expect(screen.queryByRole('form')).not.toBeInTheDocument()
    });

    it('clicking on migrate arrow calls the onMigrate Fn', async () => {

        const user = userEvent.setup()
        const migrateFn = jest.fn()
        render(<JotListItem jot={testJot} isToday={false} onMigrate={migrateFn}/>)

        const arrow = screen.getByTestId('arrow');

        await user.click(arrow);

        expect(arrow).toBeInTheDocument();
        expect(migrateFn).toHaveBeenCalled()
    });

    it("does not let user edit task after it is marked complete", async () => {
        const user = userEvent.setup();
        testJot.status = Status.COMPLETED;

        render(<JotListItem jot={testJot} isToday={false} onMigrate={jest.fn()}/>);

        const content = screen.getByTestId('content');

        await user.click(content);

        await waitFor(() => {
            expect(screen.queryByRole('form')).not.toBeInTheDocument();
        });
        

    });

    it("does not let user migrate notes", () => {
        testJot.type = Type.NOTE;

        const migrateFn = jest.fn()
        render(<JotListItem jot={testJot} isToday={false} onMigrate={migrateFn} />);

        expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
        expect(migrateFn).not.toHaveBeenCalled();

    })
})      