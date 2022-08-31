import DateHeader from "components/DateHeader";
import JotList from "components/JotList";
import NewJotForm from "components/NewJotForm";
import { FormikValues } from "formik";
import axios from "axios";
import useSWR from 'swr';

const fetcher = ( url:string ) => axios.get(url).then(res => res.data)

const JotPage = () => {

    const { data, error } = useSWR('/api/jots', fetcher, {refreshInterval: 1000});

    const addJot = async (values: FormikValues) => {
        await axios.post('/api/jots', values)
    }

    return (
        !error ? (
            <>
                <DateHeader />
                <JotList jots={data}/>
                <NewJotForm onSubmit={addJot}/>
            </>
        ): (
            <p>Could not connect to server</p>
        )
        
    )
}

export default JotPage;