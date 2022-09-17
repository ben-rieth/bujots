import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import AuthForm from 'components/auth/AuthForm';

describe('Test AuthForm Component', () => {
    it('renders email input, submit button, and header in login mode', () => {
        render(<AuthForm />)

        const header = screen.getByRole('heading');
        const emailField = screen.getByLabelText('Email*');
        const submit = screen.getByRole('button');

        expect(header).toHaveTextContent('Welcome to BuJots!')
        expect(emailField).toBeInTheDocument();
        expect(submit).toBeInTheDocument();
    });

    it('renders an error message if email is not formatted correctly', async () => {
        const user = userEvent.setup()
        render(<AuthForm />)

        const emailField = screen.getByLabelText('Email*');
        
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();

        await user.type(emailField, 'badEmail');
        await user.click(document.body);

        expect(emailField).toHaveValue('badEmail');
        expect(screen.queryByTestId('error')).toBeInTheDocument();
        expect(screen.queryByTestId('error')).toHaveTextContent('Invalid email');
    });
})
