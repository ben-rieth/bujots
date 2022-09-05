import { PrismaClient, Status, Type } from "@prisma/client";
import { startOfToday, sub } from "date-fns";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.dailyList.deleteMany({});

    const today = await prisma.dailyList.create({
        data: {
            date: startOfToday(),
            jots: {
                create: [
                    {
                        content: 'today event',
                        status: Status.ACTIVE,
                        type: Type.EVENT,
                        important: false
                    },
                    {
                        content: 'today task',
                        status: Status.ACTIVE,
                        type: Type.TASK,
                        important: false
                    },
                    {
                        content: 'today note',
                        status: Status.ACTIVE,
                        type: Type.NOTE,
                        important: false
                    },
                ]
            }
        }
    });

    const yesterday = await prisma.dailyList.create({
        data: {
            date: sub(startOfToday(), { days: 1}),
            jots: {
                create: [
                    {
                        content: 'yesterday event',
                        status: Status.ACTIVE,
                        type: Type.EVENT,
                        important: false
                    },
                    {
                        content: 'yesterday task',
                        status: Status.ACTIVE,
                        type: Type.TASK,
                        important: false
                    },
                    {
                        content: 'yesterday note',
                        status: Status.ACTIVE,
                        type: Type.NOTE,
                        important: false
                    },
                ]
            }
        }
    });

    const twoDaysAgo = await prisma.dailyList.create({
        data: {
            date: sub(startOfToday(), { days: 2}),
            jots: {
                create: [
                    {
                        content: 'two days ago event',
                        status: Status.ACTIVE,
                        type: Type.EVENT,
                        important: false
                    },
                    {
                        content: 'two days ago task',
                        status: Status.ACTIVE,
                        type: Type.TASK,
                        important: false
                    },
                    {
                        content: 'two days ago note',
                        status: Status.ACTIVE,
                        type: Type.NOTE,
                        important: false
                    },
                ]
            }
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)
    })