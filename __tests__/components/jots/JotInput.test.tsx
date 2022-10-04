import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';

import JotInput from 'components/jots/JotInput';

describe('Testing JotInput component', () => {
    it('renders a text input box', () => {
        render(<JotInput />);

        const form = screen.getByRole('form');
        const input = screen.getByLabelText('New Jot');

        expect(form).toBeInTheDocument();
        expect(form).toContainElement(input);

        expect(input).toBeInTheDocument();
    })
})