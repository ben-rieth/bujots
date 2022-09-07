import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { format, startOfToday, startOfYesterday } from 'date-fns';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import JotList from 'components/jots/JotList';
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
        const today = format(startOfToday(), 'MMMM d, yyyy')

        render(<JotList daysAgo={0} />);

        expect(screen.getByRole('heading').textContent).toBe(today);
    });

    it("reveals JotForm when Add Jot is clicked", async () => {
        const user = userEvent.setup();
        
        render(<JotList daysAgo={0}/>);

        const addBtn = screen.getByTestId('add')
        expect(addBtn).toBeInTheDocument();

        await user.click(addBtn);
        expect(addBtn).not.toBeInTheDocument();
        expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it("does not show Add Jot btn when not today", () => {
        const yesterday = startOfYesterday();

        render(<JotList daysAgo={1} />);

        const addBtn = screen.queryByTestId('add');
        expect(addBtn).not.toBeInTheDocument();
    });

    it("gets jots from the server and displays them on screen", () => {
        render(<JotList daysAgo={0}/>);

        const jots = screen.getAllByRole('article');

        expect(jots.length).toBe(2);
    });

})