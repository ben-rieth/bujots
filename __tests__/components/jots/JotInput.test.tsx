import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import JotInput from 'components/jots/JotInput';

describe('Testing JotInput component', () => {
    it('renders a text input box', () => {
        render(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');

        expect(form).toBeInTheDocument();
        expect(form).toContainElement(input);

        expect(input).toBeInTheDocument();
    });

    it('renders a row of buttons when text input is focused', async () => {
        const user = userEvent.setup();
        render(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');

        expect(screen.getByTestId('important')).toBeInTheDocument();
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();

        expect(screen.getByRole('button')).toHaveTextContent('Add');
    })
})