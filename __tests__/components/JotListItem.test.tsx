import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IoEllipseOutline, IoTriangleOutline, IoRemove } from 'react-icons/io5';

import JotListItem from 'components/JotListItem';
import { Jot, Type } from '@prisma/client';

describe("Testing Jot Component", () => {

    const testJot : Jot = {
        id: 'id',
        content: 'This is a jot',
        type: Type.NOTE,
        important: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    it('displays the text content of the jot', () => {
        render(<JotListItem jot={testJot} />);

        const content = screen.getByText('This is a jot');

        expect(content).toBeInTheDocument();
    });

    it('displays a dash if the jot is a NOTE', () => {
        testJot.type = Type.NOTE;

        render(<JotListItem jot={testJot} />);

        const icon = screen.getByTestId('dash');
        expect(icon).toBeInTheDocument();

    });

    it('displays a triangle if the jot is an EVENT', () => {
        testJot.type = Type.EVENT;

        render(<JotListItem jot={testJot} />)

        const icon = screen.getByTestId('triangle-outline');
        expect(icon).toBeInTheDocument();
    });

    it('displays a circle if the jot is a TASK', () => {
        testJot.type = Type.TASK;

        render(<JotListItem jot={testJot} />)

        const icon = screen.getByTestId('circle-outline');
        expect(icon).toBeInTheDocument();
    })
})      