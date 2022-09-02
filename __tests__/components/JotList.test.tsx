import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { startOfYesterday } from 'date-fns';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import JotList from 'components/JotList';
import { returnedJots } from 'mock/FakeJots';

const server = setupServer(
    rest.get('/api/jots', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(returnedJots)
        )
    })
);

beforeAll(() => server.listen());

afterAll(() => server.close());
afterEach(() => server.resetHandlers())

describe("Testing JotList Component", () => {

    it('contains a header for the specified date', () => {
        const providedDate = new Date('1995-12-17T03:24:00')

        render(<JotList date={providedDate} />);

        expect(screen.getByRole('heading').textContent).toBe("December 17, 1995")
    });

    it("reveals JotForm when Add Jot is clicked", async () => {
        const user = userEvent.setup();
        
        render(<JotList date={new Date()}/>);

        const addBtn = screen.getByTestId('add')
        expect(addBtn).toBeInTheDocument();

        await user.click(addBtn);
        expect(addBtn).not.toBeInTheDocument();
        expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it("does not show Add Jot btn when not today", () => {
        const yesterday = startOfYesterday();

        render(<JotList date={yesterday} />);

        const addBtn = screen.queryByTestId('add');
        expect(addBtn).not.toBeInTheDocument();
    });

    it("gets jots from the server and displays them on screen", () => {
        render(<JotList date={new Date()} />);

        const jots = screen.getAllByRole('article');

        expect(jots.length).toBe(2);
    })
})