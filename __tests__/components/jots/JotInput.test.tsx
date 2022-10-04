import { fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { inputFormat, displayFormat } from "lib/formatDates";
import JotInput from 'components/jots/JotInput';
import { startOfTomorrow } from 'date-fns';

describe('Testing JotInput component', () => {
    it('renders a text input box', () => {
        render(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');

        expect(form).toBeInTheDocument();
        expect(form).toContainElement(input);

        expect(input).toBeInTheDocument();
    });

    it('renders a row of buttons when text input is focused', () => {
        render(<JotInput />);

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
        
    })
})