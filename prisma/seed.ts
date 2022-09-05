import { Type } from '@prisma/client';
import { startOfToday, sub } from 'date-fns';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {

    const today = startOfToday();
    const yesterday = sub(today, { days: 1});
    const twoDaysAgo = sub(today, { days: 2 });
    const threeDaysAgo = sub(today, { days: 3 })

    await prisma.jot.deleteMany({})

    await prisma.jot.createMany({
        data: [
            { content: 'today event', date: today, important: false, type: Type.EVENT },
            { content: 'today event 2', date: today, important: false, type: Type.EVENT },
            { content: 'today task', date: today, important: false, type: Type.TASK },
            { content: 'today note', date: today, important: false, type: Type.NOTE },
            { content: 'yesterday event', date: yesterday, important: false, type: Type.EVENT },
            { content: 'yesterday event 2', date: yesterday, important: false, type: Type.EVENT },
            { content: 'yesterday task', date: yesterday, important: false, type: Type.TASK },
            { content: 'yesterday note', date: yesterday, important: false, type: Type.NOTE },
            { content: 'twoDaysAgo event', date: twoDaysAgo, important: false, type: Type.EVENT },
            { content: 'twoDaysAgo event 2', date: twoDaysAgo, important: false, type: Type.EVENT },
            { content: 'twoDaysAgo task', date: twoDaysAgo, important: false, type: Type.TASK },
            { content: 'twoDaysAgo note', date: twoDaysAgo, important: false, type: Type.NOTE },
            { content: 'threeDaysAgo event', date: threeDaysAgo, important: false, type: Type.EVENT },
            { content: 'threeDaysAgo event 2', date: threeDaysAgo, important: false, type: Type.EVENT },
            { content: 'threeDaysAgo task', date: threeDaysAgo, important: false, type: Type.TASK },
            { content: 'threeDaysAgo note', date: threeDaysAgo, important: false, type: Type.NOTE },
        ]
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (err) => {
        console.error(err)
        await prisma.$disconnect()
        process.exit(1)
    })