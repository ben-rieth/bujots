import DateHeader from "components/DateHeader";
import JotList from "components/JotList";
import { FormikValues } from "formik";
import axios from "axios";
import useSWR from 'swr';
import { useState } from "react";
import JotForm from "components/JotForm";
import { IoAdd } from 'react-icons/io5';

const fetcher = ( url:string ) => axios.get(url).then(res => res.data)

const JotPage = () => {

    const [newJotFormVisible, setNewJotFormVisible] = useState<boolean>(false);

    const { data, error } = useSWR('/api/jots', fetcher, {refreshInterval: 1000});

    const addJot = async (values: FormikValues) => {
        await axios.post('/api/jots', values)
    }

    const closeForm = () => setNewJotFormVisible(false);
    const openForm = () => setNewJotFormVisible(true)

    return (
        <main className="px-3">
            <DateHeader />
            <JotList jots={data}/>
                    
            {newJotFormVisible ? (
                <JotForm onSubmit={addJot} done={closeForm} />
            ) : (
                <button 
                    className="flex items-center"
                    onClick={openForm}
                >
                    <IoAdd data-testid="add" className="w-8 h-8"/>
                    <p className="text-xl">New Jot</p>
                </button>
            )}
        </main>
        
    )
}

export default JotPage;