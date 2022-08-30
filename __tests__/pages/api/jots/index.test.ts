import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod, MockResponse } from 'node-mocks-http';

import handler from 'pages/api/jots/index';

describe("Testing /api/jots handler", () => {

    const mockRequestResponse = (method: RequestMethod = 'POST') => {
        
        const { req, res }: { req: NextApiRequest, res: MockResponse<NextApiResponse>} = createMocks({ method });

        return { req, res };
    }

    it('returns a 405 code if the request is not a POST request', async () => {
        const { req, res } = mockRequestResponse('GET');

        await handler(req, res);

        expect(res.getHeader('Allow')).toEqual(['POST'])
        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                message: 'HTTP method GET is not supported'
            })
        )
        
    })
})