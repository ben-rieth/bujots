import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import BottomNav from 'components/nav/BottomNav';

describe('Testing BottomNav component', () => {
    it('renders three links and a nav component', () => {
        render(<BottomNav />);

        const links = screen.getAllByRole('link');

        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(links.length).toBe(3);
    });
})
