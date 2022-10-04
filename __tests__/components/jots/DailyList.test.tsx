import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DailyList from 'components/jots/DailyList';
import { format, startOfToday, startOfTomorrow } from 'date-fns';

describe('Testing DailyList component', () => {
    it('renders', () => {
        render(<DailyList />)
    })
})