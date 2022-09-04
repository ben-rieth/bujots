import { Type, Jot, Status } from '@prisma/client';

const date = new Date()

const jotsInDB: Jot[] = [
    {
        content: 'This is jot',
        type : Type.NOTE,
        status: Status.ACTIVE,
        important: false,
        id: 'id',
        createdAt: date,
        updatedAt: date,
        listId: 'listId'
    },
    {
        content: 'This is a second jot',
        type : Type.EVENT,
        status: Status.ACTIVE,
        important: false,
        id: 'id2',
        createdAt: date,
        updatedAt: date,
        listId: 'listId'
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
        listId: 'listId'
    },
    {
        content: 'This is a second jot',
        type : Type.EVENT,
        status: Status.ACTIVE,
        important: false,
        id: 'id2',
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        listId: 'listId'
    }
]

export {
    jotsInDB,
    returnedJots
}