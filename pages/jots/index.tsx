import DateHeader from "components/DateHeader";
import JotList from "components/JotList";
import { Type } from '@prisma/client';

const JotPage = () => {

    return (
        <>
            <DateHeader />
            <JotList jots={[
                {
                    id: 'id',
                    content: 'This is a jot',
                    type: Type.TASK,
                    important: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]}/>
        </>
    )
}

export default JotPage;