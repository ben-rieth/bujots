import { fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { inputFormat, displayFormat } from "lib/formatDates";
import JotInput from 'components/jots/forms/JotInput';
import { addDays, startOfTomorrow } from 'date-fns';
import { renderWithClient } from 'utils/tests';

describe('Testing JotInput component', () => {
    it('renders a text input box and dropdown for type', () => {
        renderWithClient(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');
       
        expect(form).toBeInTheDocument();
        expect(form).toContainElement(input);

        expect(input).toBeInTheDocument();

        
    });

    it('renders a row of buttons below text input', () => {
        renderWithClient(<JotInput />);

        const dropdown = screen.getByRole('combobox')

        expect(dropdown).toBeInTheDocument();
        expect(dropdown.childNodes.length).toBe(3);

        expect(screen.getByTestId('important')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();

        expect(screen.getByRole('button')).toHaveTextContent('Add');
    });

    // it('allows user to enter text for selected date', async () => {
    //     const tomorrow = addDays(new Date(), 1);
        
    //     const user = userEvent.setup();
    //     renderWithClient(<JotInput />);

    //     const input = screen.getByLabelText('New Jot');

    //     await user.click(input);
    //     await user.type(input, 'homework due tomorrow');

    //     waitFor(() => {
    //         expect(screen.getByTestId('date')).toHaveTextContent(displayFormat(tomorrow));
    //     });

    //     await user.type(input, "[Backspace][Backspace][Backspace][Backspace][Backspace][Backspace][Backspace][Backspace]");

    //     waitFor(() => {
    //         expect(screen.queryByTestId('date')).not.toBeInTheDocument();
    //     });
    // });

    // it('allows user to overwrite selected date with date entered in text box', async () => {
    //     const tomorrow = addDays(new Date(), 1);
    //     const twoDays = addDays(new Date(), 2);

    //     const user = userEvent.setup();
    //     renderWithClient(<JotInput />);

    //     const textInput = screen.getByLabelText('New Jot');
    //     const dateInput = screen.getByTestId('date-input');

    //     fireEvent.change(dateInput, { target: {value: inputFormat(twoDays)}});

    //     expect(screen.getByTestId('date')).toBeInTheDocument();
    //     //expect(screen.getByTestId('date')).toHaveTextContent(displayFormat(twoDays));

    //     await user.click(textInput);
    //     await user.type(textInput, 'home due tomorrow');

    //     waitFor(() => {
    //         expect(screen.getByTestId('date')).toHaveTextContent(displayFormat(tomorrow));
    //     });
        
    // })


})