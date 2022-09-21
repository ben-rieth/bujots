import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as NextAuth from 'next-auth/react';

import AuthForm from 'components/auth/AuthForm';

describe('Test AuthForm Component', () => {
    
    it('renders email input, submit button, and header in login mode', () => {
        render(<AuthForm />)

        const header = screen.getByRole('heading');
        const emailField = screen.getByLabelText('Email*');
        const submit = screen.getByText('Sign Up');

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

    it('allows user to switch between sign up and sign in tabs in form', async () => {
        const user = userEvent.setup();

        render(<AuthForm />)

        const registerBtn = screen.getByTestId('register');
        const loginBtn = screen.getByTestId('login');

        expect(screen.queryByText('Sign Up')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();

        await user.click(loginBtn);

        expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
        expect(screen.queryByText('Sign In')).toBeInTheDocument();

        await user.click(registerBtn);

        expect(screen.queryByText('Sign Up')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    })

    it('shows a confirm message after a valid email is entered', async () => {
        const spy = jest.spyOn(NextAuth, 'signIn').mockResolvedValue(undefined);
        
        const user = userEvent.setup();
        render(<AuthForm />);

        const emailField = screen.getByLabelText('Email*');
        const signUpButton = screen.getByText('Sign Up')

        expect(screen.queryByTestId('confirm')).not.toBeInTheDocument();

        await user.type(emailField, 'email@email.com');
        await user.click(signUpButton);

        expect(spy).toHaveBeenCalled();
        waitFor(() => {
            expect(screen.queryByTestId('confirm')).toBeInTheDocument();
        })
        
    });
})
