import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {

        const { content, type, important } = req.body;

        if (content === undefined || type === undefined || important === undefined) {
            return res.status(400).json({
                message: 'Missing one or more required fields'
            })
        }

        const jot = await prisma.jot.create({
            data: {
                content,
                type,
                important
            }
        });

        res.status(200).json(jot);


    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({
            message: `HTTP method ${req.method} is not supported`
        })
    }
}

export default handler;