import DateHeader from "components/DateHeader";
import JotList from "components/JotList";
import NewJotForm from "components/NewJotForm";
import { Type } from '@prisma/client';
import { FormikValues } from "formik";
import axios from "axios";
import useSWR from 'swr';

const fetcher = ( url:string ) => axios.get(url).then(res => res.data)

const JotPage = () => {

    const { data, error } = useSWR('/api/jots', fetcher);

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