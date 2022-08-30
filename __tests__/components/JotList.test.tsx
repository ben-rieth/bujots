import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import JotList from 'components/JotList';

describe("Testing JotList Component", () => {
    it('Says there are no jots when the jots list is empty', () => {
        render(<JotList jots={[]}/>)

        const container = screen.getByRole('article');
        const noJots = screen.getByRole('note');

        expect(container).toBeInTheDocument();
        expect(noJots.textContent).toBe("There are no jots yet!")
    });
})