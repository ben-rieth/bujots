import { Type } from '@prisma/client';
import { startOfToday, sub } from 'date-fns';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type JotInputs = {
    content: string
    important: boolean
    type: Type
    date: Date
}

const generateJots = () => {
    const today = startOfToday()
    const importantThreshold = .9;

    const days = new Map();
    days.set('today', today);
    days.set('yesterday', sub(today, { days: 1}));
    

    for(let i = 2; i < 16; i++ ) {
        days.set(`${i}daysAgo`, sub(today, { days: i}));
    }

    const jotTypes = new Map();
    jotTypes.set('event 1', Type.EVENT);
    jotTypes.set('event 2', Type.EVENT);
    jotTypes.set('task', Type.TASK);
    jotTypes.set('note', Type.NOTE);

    let toCreate : JotInputs[] = [];

    const importantChance = Math.random();
    days.forEach((date: Date, dayText: string) => {
        jotTypes.forEach((type: Type, typeText: string) => {

            toCreate.push({
                content: `${dayText} ${typeText}`,
                important: importantChance > importantThreshold,
                date: date,
                type: type
            })
        })
    });

    return toCreate;
}

const main = async () => {

    const jots = generateJots();

    await prisma.jot.deleteMany({})

    await prisma.jot.createMany({
        data: jots
    });
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