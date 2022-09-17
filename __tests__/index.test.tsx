import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/index';

describe('Testing Home Component', () => {
    it('renders auth form', () => {
        render(<Home />);

        const form = screen.getByRole('form');

        expect(form).toBeInTheDocument()
    })
})