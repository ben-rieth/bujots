import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { startOfToday, sub } from "date-fns";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {

        const { content, type, important } = req.body;

        if (content === undefined || type === undefined || important === undefined) {
            return res.status(400).json({
                message: 'Missing one or more required fields'
            })
        }

        try {

            const jot = await prisma.jot.create({
                data: {
                    content,
                    type,
                    important
                }
            });

            res.status(200).json(jot);
        } catch(err) {
            res.status(500).json({
                message: "Something went wrong"
            })
        }


    } else if (req.method === 'GET') {

        let daysAgo = req.query.daysAgo as string;

        if(!daysAgo) daysAgo = "0"

        if(isNaN(parseInt(daysAgo))) {
            return res.status(400).json({
                message: "daysAgo parameter must be a number"
            })
        }

        const today = startOfToday();
        const targetDay = sub(today, { days: Number(daysAgo)});

        try {

            const jots = await prisma.jot.findMany({
                where: { date: targetDay },
                orderBy: { createdAt: 'asc'}
            });

            res.status(200).json(jots);

        } catch (err) {
            res.status(500).json({
                message: 'Something went wrong'
            })
        }

    } else {
        res.setHeader('Allow', ['POST', 'GET'])
        res.status(405).json({
            message: `HTTP method ${req.method} is not supported`
        });
    }
}

export default handler;