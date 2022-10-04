import { fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { inputFormat, displayFormat } from "lib/formatDates";
import JotInput from 'components/jots/JotInput';
import { addDays, startOfTomorrow } from 'date-fns';

describe('Testing JotInput component', () => {
    it('renders a text input box and dropdown for type', () => {
        render(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');
       
        expect(form).toBeInTheDocument();
        expect(form).toContainElement(input);

        expect(input).toBeInTheDocument();

        
    });

    it('renders a row of buttons below text input', () => {
        render(<JotInput />);

        const dropdown = screen.getByRole('combobox')

        expect(dropdown).toBeInTheDocument();
        expect(dropdown.childNodes.length).toBe(3);

        expect(screen.getByTestId('important')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();

        expect(screen.getByRole('button')).toHaveTextContent('Add');
    });

    it('does not show date unless one is selected', async () => {

        const tomorrowInput = inputFormat(startOfTomorrow());
        const tomorrowDisplay = displayFormat(startOfTomorrow());

        render(<JotInput />);

        const input = screen.getByTestId('date-input')

        expect(screen.queryByTestId('date')).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: tomorrowInput }});

        const dateText = screen.queryByTestId('date');
        expect(dateText).toBeInTheDocument();
        //expect(dateText).toHaveTextContent(tomorrowDisplay);

        fireEvent.change(input, { target: { value: undefined }});
        waitFor(() => {
            expect(screen.queryByTestId('date')).not.toBeInTheDocument();
        })
        
    });

    it('allows user to enter text for selected date', async () => {
        const tomorrow = addDays(new Date(), 1);
        
        const user = userEvent.setup();
        render(<JotInput />);

        const input = screen.getByLabelText('New Jot');

        await user.click(input);
        await user.type(input, 'homework due tomorrow');

        waitFor(() => {
            expect(screen.getByTestId('date')).toHaveTextContent(displayFormat(tomorrow));
        });

        await user.type(input, "[Backspace][Backspace][Backspace][Backspace][Backspace][Backspace][Backspace][Backspace]");

        waitFor(() => {
            expect(screen.queryByTestId('date')).not.toBeInTheDocument();
        })
    });
})