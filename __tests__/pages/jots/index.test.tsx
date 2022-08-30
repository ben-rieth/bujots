import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import JotPage from 'pages/jots/index';

describe('Testing JotPage Component', () => {
    it('renders the current date as the header', () => {
        render(<JotPage />);

        const date = (new Date()).toLocaleDateString(
            undefined, 
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );

        const header = screen.getByRole('heading');

        expect(header).toHaveTextContent(date);
    });
    
})