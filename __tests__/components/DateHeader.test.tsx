import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

import DateHeader from 'components/DateHeader';

describe('Testing DateHeader Component', () => {
    it('renders the current date with no props', () => {

        render(<DateHeader />)

        const date = (new Date()).toLocaleDateString(
            undefined, 
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );

        const header = screen.getByRole('heading');

        expect(header.textContent).toBe(date);
    });

    it('renders date given in date prop', () => {
        const providedDate = new Date('1995-12-17T03:24:00')

        render(<DateHeader date={providedDate}/>)

        const header = screen.getByRole('heading');

        expect(header.textContent).toBe("December 17, 1995")
    });

    it('renders back arrow but no forward arrow date is today', () => {
        render(<DateHeader />);
        
        const back = screen.getByTestId("back");
        const forward = screen.queryByTestId("forward");

        expect(back).toBeInTheDocument();
        expect(forward).not.toBeInTheDocument();
    })
})