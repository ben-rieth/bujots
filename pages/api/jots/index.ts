import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {

    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({
            message: `HTTP method ${req.method} is not supported`
        })
    }
}

export default handler;