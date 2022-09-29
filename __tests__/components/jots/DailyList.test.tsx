import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DailyList from 'components/jots/DailyList';
import { format, startOfToday } from 'date-fns';

describe('Testing DailyList component', () => {
    it('renders the current date in a header', () => {
    
        const today = format(startOfToday(), 'MMMM d, yyyy')

        render(<DailyList />);

        waitFor(() => {
            expect(screen.getByRole('heading').textContent).toBe(today);
        })
    });
})