import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod, MockResponse } from 'node-mocks-http';
import { Jot, PrismaClient, Status, Type } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import handler from 'pages/api/jots/[id]';
import { prisma } from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>()
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const date = new Date();

const jot = {
    content: 'new content',
}

const fullJot : Jot = {
    content: 'new content',
    type : Type.NOTE,
    status: Status.ACTIVE,
    important: false,
    id: 'id',
    createdAt: date,
    updatedAt: date,
    date: date
}

describe('Testing /api/jots/[id] api handler', () => {
    const mockRequestResponse = (method: RequestMethod, body: {} = {}, query: {} = {}) => {
        const { 
            req, 
            res 
        } : { req: NextApiRequest, res: MockResponse<NextApiResponse> } = createMocks({ method });

        req.body = body;
        req.query = query;

        return { req, res };
    }

    it('returns a 405 header when a PATCH request isn\'t used', async () => {
        const { req, res } = mockRequestResponse('POST');

        await handler(req, res);

        expect(res.getHeader('Allow')).toEqual(['PATCH'])
        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: 'HTTP method POST is not supported'
            })
        );
    });

    it('returns a 200 status if jot is updated successfully', async () => {
        const { req, res } = mockRequestResponse('PATCH', jot, "id");

        prismaMock.jot.update.mockResolvedValue(fullJot);

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                ...fullJot,
                createdAt: date.toISOString(),
                updatedAt: date.toISOString(),
                date: date.toISOString()
            })
        )
    });

    it('if migrate is true, returns a 200 status if jot is successfully migrated', async () => {
        const { req, res } = mockRequestResponse("PATCH", {}, {id: "id", migrate: "true"});

        prismaMock.jot.update.mockResolvedValue(fullJot);

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                ...fullJot,
                createdAt: date.toISOString(),
                updatedAt: date.toISOString(),
                date: date.toISOString()
            })
        );
    })

    it('returns a 500 status if there is an error', async () => {
        const { req ,res } = mockRequestResponse('PATCH', jot, "id");

        prismaMock.jot.update.mockRejectedValueOnce(new Error('Database Error'));

        await handler(req, res);
        
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: "Something went wrong"
            })
        )
    })
})