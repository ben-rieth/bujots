import { Jot } from "@prisma/client";
import { FC, useState } from "react";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from 'axios';
import DateHeader from "./DateHeader";
import JotListItem from "./JotListItem";
import JotForm from "./JotForm";
import { IoAdd } from "react-icons/io5";
import { isToday } from "date-fns";

type JotListProps = {
    date: Date
}

const fetcher: Fetcher<Jot[], string> = ( url:string ) => axios.get(url).then(res => res.data);

const JotList: FC<JotListProps> = ({ date}) => {

    const [newJotFormVisible, setNewJotFormVisible] = useState<boolean>(false);

    const { data } = useSWR('/api/jots', fetcher);
    const { mutate } = useSWRConfig(); 

    const addJot = async (values: Partial<Jot>) => {
        const newJot = await axios.post('/api/jots', values)
        mutate('/api/jots', [...data!, newJot])
    }

    const closeForm = () => setNewJotFormVisible(false);
    const openForm = () => setNewJotFormVisible(true)

    return (
        <section data-testid="section">
            <DateHeader date={date}/>

            {data && data.map((jot: Jot) => {
                return (
                    <div key={jot.id}>
                        <JotListItem jot={jot} />
                        <hr />
                    </div>
                )     
            })}

            {newJotFormVisible && (
                <JotForm onSubmit={addJot} done={closeForm} />
            )} 

            {!newJotFormVisible && isToday(date) && (
                <button 
                    className="flex items-center"
                    onClick={openForm}
                >
                    <IoAdd data-testid="add" className="w-6 h-6"/>
                    <p className="text-lg">New Jot</p>
                </button>
            )}
            
        </section>
    )
}

export default JotList;