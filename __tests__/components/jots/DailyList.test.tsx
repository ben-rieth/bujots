import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DailyList from 'components/jots/DailyList';
import { format, startOfToday, startOfTomorrow } from 'date-fns';

describe('Testing DailyList component', () => {
    it('renders the specified date in a header pt. 1', () => {
    
        const today = format(startOfToday(), 'MMMM d, yyyy')

        render(<DailyList date={startOfToday()}/>);

        waitFor(() => {
            expect(screen.getByRole('heading').textContent).toBe(today);
        })
    });

    it('renders the specified date in the header pt. 2', () => {
        const tomorrow = format(startOfTomorrow(), 'MMMM d, yyyy');

        render(<DailyList date={startOfTomorrow()} />);

        waitFor(() => {
            expect(screen.getByRole('heading').textContent).toBe(tomorrow);
        })
    })
})