import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod, MockResponse } from 'node-mocks-http';
import { Jot, PrismaClient, Status, Type } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import handler from 'pages/api/jots/index';
import { prisma } from 'lib/prisma';
import { startOfToday, sub } from 'date-fns';

jest.mock('lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>()
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("Testing /api/jots handler", () => {

    const date = new Date();

    const jot = {
        content: 'This is jot',
        type : Type.NOTE,
        important: false
    }

    const incompleteJot = {
        type : Type.NOTE,
        important: false
    }

    const jotsInDB : Jot[] = [
        {
            content: 'This is jot',
            type : Type.NOTE,
            status: Status.ACTIVE,
            important: false,
            id: 'id',
            createdAt: date,
            updatedAt: date,
            date: date
        },
        {
            content: 'This is a second jot',
            type : Type.EVENT,
            status: Status.ACTIVE,
            important: false,
            id: 'id2',
            createdAt: date,
            updatedAt: date,
            date: date
        },
    ];

    const mockRequestResponse = (method: RequestMethod = 'POST', body: {} = {}, query: {} = {}) => {
        
        const { req, res }: { req: NextApiRequest, res: MockResponse<NextApiResponse>} = createMocks({ method });
        req.body = body;
        req.query = query;

        return { req, res };
    }

    it('returns a 405 code if the request is not a POST or GET request', async () => {
        const { req, res } = mockRequestResponse('PUT');

        await handler(req, res);

        expect(res.getHeader('Allow')).toEqual(['POST', 'GET'])
        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: 'HTTP method PUT is not supported'
            })
        )
        
    });

    it('returns a 400 code if content, type, and important fields are not present', async () => {
        const { req, res } = mockRequestResponse('POST', incompleteJot);

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: 'Missing one or more required fields'
            })
        )
    });

    it('returns a 200 code and the jot object if jot is successfully added to db', async () => {
        const { req, res } = mockRequestResponse('POST', jot);

        prismaMock.jot.create.mockResolvedValue({
            ...jot, 
            id: 'id',
            status: Status.ACTIVE,
            createdAt: date, 
            updatedAt: date,
            date: date
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                ...jot, 
                id: 'id',
                createdAt: date.toISOString(), 
                updatedAt: date.toISOString()
            })
        )
    });

    it('returns a list of jots when /api/jots receives a GET request', async () => {
        const { req, res } = mockRequestResponse('GET', {});

        prismaMock.jot.findMany.mockResolvedValue(jotsInDB);

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().length).toBe(2)
        expect(res._getJSONData()).toEqual(
            expect.arrayContaining(
                [
                    {
                        ...jotsInDB[0],
                        createdAt: date.toISOString(),
                        updatedAt: date.toISOString(),
                        date: date.toISOString()
                    },
                    {
                        ...jotsInDB[1],
                        createdAt: date.toISOString(),
                        updatedAt: date.toISOString(),
                        date: date.toISOString()
                    }
                ]
            )
        )
    });

    it('returns a 400 code if the daysAgo parameter is not a number', async () => {
        const { req, res } = mockRequestResponse('GET', {}, { daysAgo: 'abc'});

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: "daysAgo parameter must be a number"
            })
        )
    });


    it('returns a 500 code if there is a server error', async () => {
        const { req, res } = mockRequestResponse('POST', jot);
        
        prismaMock.jot.create.mockRejectedValue(new Error('Database Error'));

        await handler(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: "Something went wrong"
            })
        )
    })
})