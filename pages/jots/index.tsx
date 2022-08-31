import DateHeader from "components/DateHeader";
import JotList from "components/JotList";
import NewJotForm from "components/NewJotForm";
import { Type } from '@prisma/client';
import axios from "axios";
import { FormikValues } from "formik";

const JotPage = () => {

    const addJot = async (values: FormikValues) => {
        await axios.post('/api/jots', values)
    }

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
            <NewJotForm onSubmit={addJot}/>
        </>
    )
}

export default JotPage;