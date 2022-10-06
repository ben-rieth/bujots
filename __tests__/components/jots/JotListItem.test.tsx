import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import JotListItem from 'components/jots/JotListItem';
import { Jot, Type, Status } from '@prisma/client';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const testJot : Jot = {
    id: 'id',
    content: 'This is a jot',
    status: Status.ACTIVE,
    type: Type.NOTE,
    important: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: new Date()
}

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

describe("Testing JotListItem Component", () => {
    it('displays the text content of the jot', () => {
        render(<JotListItem jot={testJot} isToday={true}/>);

        const content = screen.getByText('This is a jot');

        expect(content).toBeInTheDocument();
    });

    it('displays a dash if the jot is a NOTE', () => {
        testJot.type = Type.NOTE;

        render(<JotListItem jot={testJot} isToday={true}/>);

        const icon = screen.getByTestId('dash');
        expect(icon).toBeInTheDocument();

    });

    it('displays a triangle if the jot is an EVENT', () => {
        testJot.type = Type.EVENT;

        render(<JotListItem jot={testJot} isToday={true}/>)

        const icon = screen.getByTestId('triangle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('displays a circle if the jot is a TASK', () => {
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={true}/>)

        const icon = screen.getByTestId('circle-outline');
        expect(icon).toBeInTheDocument();
    });
})

describe.skip("Testing Old Jot Component", () => {

    const testJot : Jot = {
        id: 'id',
        content: 'This is a jot',
        status: Status.ACTIVE,
        type: Type.NOTE,
        important: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date()
    }

    it('displays the text content of the jot', () => {
        render(<JotListItem jot={testJot} isToday={true}/>);

        const content = screen.getByText('This is a jot');

        expect(content).toBeInTheDocument();
    });

    it('displays a dash if the jot is a NOTE', () => {
        testJot.type = Type.NOTE;

        render(<JotListItem jot={testJot} isToday={true}/>);

        const icon = screen.getByTestId('dash');
        expect(icon).toBeInTheDocument();

    });

    it('displays a triangle if the jot is an EVENT', () => {
        testJot.type = Type.EVENT;

        render(<JotListItem jot={testJot} isToday={true}/>)

        const icon = screen.getByTestId('triangle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('displays a circle if the jot is a TASK', () => {
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={true}/>)

        const icon = screen.getByTestId('circle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('display the edit form when clicked on', async () => {
        const user = userEvent.setup();

        render(<JotListItem jot={testJot} isToday={true}/>)

        const content = screen.getByTestId('content');

        await user.click(content);

        const form = screen.getByRole('form');
        expect(form).toBeInTheDocument();
        expect(content).not.toBeInTheDocument();
    });

    it('when task or event icon is clicked, task becomes completed', async () => {
        const user = userEvent.setup();
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} isToday={true}/>);

        const taskIcon = screen.getByTestId('circle-outline');
        expect(taskIcon).toBeInTheDocument();

        await user.click(taskIcon);
        await screen.findByTestId('circle-filled')

    });

    it('does not let user open edit form if date is not today', async () => {
        const user = userEvent.setup();

        render(<JotListItem jot={testJot} isToday={false}/>);

        const content = screen.getByTestId('content');
        await user.click(content);

        expect(screen.queryByRole('form')).not.toBeInTheDocument()
    });

    it('does not let user complete a task or event if date is not today', async () => {
        const user = userEvent.setup();
        testJot.type = "EVENT";
        testJot.status = "ACTIVE";

        render(<JotListItem jot={testJot} isToday={false}/>);

        const eventIcon = screen.getByTestId('triangle-outline');
        await user.click(eventIcon);

        expect(eventIcon).toBeInTheDocument();
        expect(screen.queryByTestId('triangle-filled')).not.toBeInTheDocument();
    })
})      