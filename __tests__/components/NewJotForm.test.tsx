import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import NewJotForm from 'components/NewJotForm'

describe('Testing NewJotForm Component', () => {
    it('initially displays button to add a new jot', () => {
        render(<NewJotForm onSubmit={jest.fn()} />);

        const button = screen.getByRole('button');
        const addIcon = screen.getByTestId('add');

        expect(button).toHaveTextContent('New Jot');
        expect(button).toContainElement(addIcon);
    });

    it('displays a form when button is clicked', async () => {
        const user = userEvent.setup();

        render(<NewJotForm onSubmit={jest.fn()} />);

        expect(screen.queryByRole('form')).not.toBeInTheDocument();

        const button = screen.getByRole("button");
        await user.click(button);

        const form = screen.getByRole('form');
        const radiogroup = screen.getByRole('radiogroup');
        const radioBtns = screen.getAllByRole('radio')

        expect(form).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/This is a jot!/i)).toBeInTheDocument();

        expect(radiogroup).toBeInTheDocument();
        expect(radioBtns.length).toBe(3);

        const submit = screen.getByRole('button');
        expect(submit).toBeInTheDocument();
    });

    it('changes the icon when the user changes the jot type', async () => {
        const user = userEvent.setup();
        render(<NewJotForm onSubmit={jest.fn()} />);
        await user.click(screen.getByRole('button'));

        const noteRadio = screen.getByLabelText('Note')
        const taskRadio = screen.getByLabelText('Task');
        const eventRadio = screen.getByLabelText('Event');

        await user.click(taskRadio);
        expect(screen.queryByTestId('circle')).toBeInTheDocument();

        await user.click(eventRadio);
        expect(screen.queryByTestId('triangle')).toBeInTheDocument();

        await user.click(noteRadio);
        expect(screen.queryByTestId('dash')).toBeInTheDocument();

    });

    it('does not allow user to submit if there is no text', async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();

        render(<NewJotForm onSubmit={submitFn} />);
        await user.click(screen.getByRole('button'));

        const submitBtn = screen.getByRole('button');
        const contentInput = screen.getByPlaceholderText(/This is a jot!/i);

        expect(contentInput).toHaveValue('');

        await user.click(submitBtn);
        expect(submitFn).not.toHaveBeenCalled();

        await user.type(contentInput, 'content');
        expect(contentInput).toHaveValue('content');

        await user.clear(contentInput);
        expect(contentInput).toHaveValue('');

        await user.click(submitBtn);
        expect(submitFn).not.toHaveBeenCalled();

    });

    it('submits the correct data', async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();

        render(<NewJotForm onSubmit={submitFn} />);
        await user.click(screen.getByRole('button'));

        const submitBtn = screen.getByRole('button');
        const contentInput = screen.getByPlaceholderText(/This is a jot!/i);
        const eventRadio = screen.getByLabelText('Event');

        await user.type(contentInput, 'New jot');
        await user.click(eventRadio);
        await user.click(submitBtn);

        expect(submitFn).toHaveBeenCalledWith({
            content: 'New jot',
            type: 'EVENT',
            important: false
        })
    });

    it('marks jot as important if exclamation mark btn is pressed', async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();

        render(<NewJotForm onSubmit={submitFn} />);
        await user.click(screen.getByRole('button'));

        const submitBtn = screen.getByRole('button');
        const contentInput = screen.getByPlaceholderText(/This is a jot!/i);
        const importantBtn = screen.getByTestId('important');

        await user.type(contentInput, 'content');
        await user.click(importantBtn);
        await user.click(submitBtn);

        expect(submitFn).toHaveBeenCalledWith({
            content: 'content',
            type: 'NOTE',
            important: true
        })
    });

    it('hides the form when user clicks outside of form', async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();

        render(<NewJotForm onSubmit={submitFn} />);
        await user.click(screen.getByRole('button'));

        expect(screen.getByRole('form')).toBeInTheDocument();

        await user.click(document.body);

        expect(screen.queryByRole('form')).not.toBeInTheDocument();
        
        const addJotBtn = screen.getByRole('button');
        expect(addJotBtn.textContent).toBe('New Jot')
    })
})