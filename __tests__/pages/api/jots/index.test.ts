import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod, MockResponse } from 'node-mocks-http';
import { DailyList, Jot, PrismaClient, Status, Type } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import handler from 'pages/api/jots/index';
import { prisma } from 'lib/prisma';
import { jotsInDB, returnedJots } from 'mock/FakeJots';

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

        prismaMock.dailyList.upsert.mockResolvedValue({
            id: 'listId',
            date: new Date()         
        });

        prismaMock.jot.create.mockResolvedValue({
            ...jot, 
            id: 'id',
            status: Status.ACTIVE,
            createdAt: date, 
            updatedAt: date,
            listId: 'listId'
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

    it('returns a 200 code and a list of jots with a GET request', async () => {
        const { req, res } = mockRequestResponse('GET');

        const listDate = new Date();

        const list : (DailyList & {jots: Jot[]}) = {
            id: 'listId',
            date: listDate,
            jots: jotsInDB
        }

        prismaMock.dailyList.findUnique.mockResolvedValue(list);

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                id: 'listId',
                date: listDate.toISOString(),
                jots: returnedJots
            })
        )
    })


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