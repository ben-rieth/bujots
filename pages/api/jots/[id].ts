import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { startOfToday } from "date-fns";

const updateJot = async () => {
    
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PATCH') {

        const isMigration = req.query.migrate as string;
        const id = req.query.id as string;

        const today = startOfToday()

        try {
            if (isMigration && isMigration.toLowerCase() === "true") {

                const todaysList = await prisma.dailyList.update({
                    where: { date: today },
                    data: {
                        jots: {
                            connect: { id }
                        }
                    }
                });

                res.status(200).json(todaysList);

            } else {
                
                const jot = await prisma.jot.update({
                    where: { id },
                    data: req.body
                });
    
                res.status(200).json(jot);
            }
        } catch(err) {
            res.status(500).json({
                message: "Something went wrong"
            })
        }


    } else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).json({
            message: `HTTP method ${req.method} is not supported`
        })
    }
}

export default handler;