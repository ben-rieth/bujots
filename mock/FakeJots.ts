import { Type, Jot, Status } from '@prisma/client';

const date = new Date()

const jotsInDB = [
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
    }
]

const returnedJots = [
    {
        content: 'This is jot',
        type : Type.NOTE,
        status: Status.ACTIVE,
        important: false,
        id: 'id',
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        date: date.toISOString()
    },
    {
        content: 'This is a second jot',
        type : Type.EVENT,
        status: Status.ACTIVE,
        important: false,
        id: 'id2',
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        date: date.toISOString()
    }
]

export {
    jotsInDB,
    returnedJots
}