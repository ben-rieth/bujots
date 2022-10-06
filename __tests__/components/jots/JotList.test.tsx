import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { format, startOfToday, startOfYesterday } from 'date-fns';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import JotList from 'components/jots/JotList';
import { returnedJots } from 'mock/FakeJots';
import { renderWithClient } from 'utils/tests';

const server = setupServer(
    rest.get('/api/jots', (_req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(returnedJots)
        )
    })
);

beforeAll(() => {
    server.listen()
});

afterAll(() => {
    server.close();
});
afterEach(() => {
    server.resetHandlers();
    jest.clearAllTimers();
})

describe("Testing JotList Component", () => {
    it('contains a header for the specified date', () => {
        const today = format(startOfToday(), 'MMMM d, yyyy')

        renderWithClient(<JotList daysAgo={0} />);

        waitFor(() => {
            expect(screen.getByRole('heading').textContent).toBe(today);
        })
        
    });

    it("gets jots from the server and displays them on screen", async () => {
        renderWithClient(<JotList daysAgo={0} />);

        const jots = await screen.findAllByRole('article');

        expect(jots.length).toBe(2);
    });

    it('displays nothing when no jots are returned', () => {
        server.use(
            rest.get('/api/jots', (_req, res, ctx) => {
                return res(
                    ctx.status(200)
                )
            })
        );

        renderWithClient(<JotList daysAgo={0} />);

        waitFor(() => {
            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
            expect(screen.queryAllByRole('article').length).toBe(0);
        })
    });

    it('displays error message when server returns error', async () => {
        server.use(
            rest.get('/api/jots', (_req, res, ctx) => {
                return res(
                    ctx.status(500)
                    
                )
            })
        );

        renderWithClient(<JotList daysAgo={0} />);

        const heading = await screen.findByRole('heading');
        const message = await screen.findByRole('alert');

        expect(heading).toHaveTextContent("There was an error");
        expect(message).toHaveTextContent("Request failed with status code 500");

    });

    it('displays loader while waiting for information', () => {
        server.use(
            rest.get('/api/jots', (_req, res, ctx) => {
                return res(
                    ctx.delay(2000),
                    ctx.status(200),
                    ctx.json(returnedJots)
                )
            })
        );

        renderWithClient(<JotList daysAgo={0} />);

        waitFor(() => {
            expect(screen.getAllByTestId('loader').length).toBe(4)
        });

        waitFor(() => {
            expect(screen.getAllByRole('article').length).toBe(2);
        });
    })

})