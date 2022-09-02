import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import JotForm from 'components/JotForm';
import { Status } from '@prisma/client';

const initialValues = {
    content: 'this was here',
    important: false,
    type: 'EVENT',
    status: 'ACTIVE',
}

describe("Testing JotForm Component", () => {
    it("can render and submit the form", async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();
        const doneFn = jest.fn();

        render(<JotForm onSubmit={submitFn} done={doneFn} />);

        const contentInput = screen.getByPlaceholderText(/this is a jot!/i);
        const importantBtn = screen.getByTestId('important');
        const radiogroup = screen.getByRole('radiogroup');
        const radioBtns = screen.getAllByRole('radio');
        const taskBtn = screen.getByLabelText('TASK')

        expect(radiogroup).toBeInTheDocument();
        expect(radioBtns.length).toBe(3);

        await user.type(contentInput, "It do be jotting time");
        await user.click(importantBtn);
        await user.click(taskBtn);
        await user.keyboard('{Enter}')

        expect(submitFn).toHaveBeenCalledWith({
            content: 'It do be jotting time',
            important: true,
            type: "TASK",
            status: "ACTIVE"
        });

        expect(doneFn).toHaveBeenCalled();

    });

    it("renders form with initial values when prop is passed and submits when changed", async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();
        const doneFn = jest.fn();

        render(<JotForm onSubmit={submitFn} done={doneFn} initialValues={initialValues}/>);

        const contentInput = screen.getByPlaceholderText(/this is a jot!/i);
        const typeIcon = screen.getByTestId('triangle');
        const actionIcon = screen.getByTestId('delete');

        expect(contentInput).toHaveValue('this was here');
        expect(typeIcon).toBeInTheDocument();
        expect(actionIcon).toBeInTheDocument();

        await user.type(contentInput, ' this is new');
        await user.click(document.body);

        expect(submitFn).toHaveBeenCalledWith({
            content: 'this was here this is new',
            status: 'ACTIVE',
            type: 'EVENT',
            important: false
        });

        expect(doneFn).toHaveBeenCalled();

    });

    it('does not submit if values have not been changed', async () => {
        const user = userEvent.setup();
        const submitFn = jest.fn();
        const doneFn = jest.fn();

        render(<JotForm onSubmit={submitFn} initialValues={initialValues} done={doneFn}/>)

        await user.keyboard('{Enter}');

        expect(submitFn).not.toHaveBeenCalled();
    });

    it('changes the icon when the user changes the jot type', async () => {
        const user = userEvent.setup();
        render(<JotForm onSubmit={jest.fn()} />);

        const noteRadio = screen.getByLabelText('NOTE')
        const taskRadio = screen.getByLabelText('TASK');
        const eventRadio = screen.getByLabelText('EVENT');

        await user.click(taskRadio);
        expect(screen.queryByTestId('circle')).toBeInTheDocument();

        await user.click(eventRadio);
        expect(screen.queryByTestId('triangle')).toBeInTheDocument();

        await user.click(noteRadio);
        expect(screen.queryByTestId('dash')).toBeInTheDocument();

    });

    it('disabled input and hides radio btns when status is deleted', () => {
        initialValues.status = Status.DELETED;
        render(<JotForm onSubmit={jest.fn()} initialValues={initialValues}/>);

        const content = screen.getByPlaceholderText(/this is a jot!/i);
        const radiogroup = screen.queryByRole('radiogroup');

        expect(content).toBeDisabled();
        expect(radiogroup).not.toBeInTheDocument();
    });
})