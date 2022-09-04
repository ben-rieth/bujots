import { DailyList, Jot } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from 'axios';
import DateHeader from "./DateHeader";
import JotListItem from "./JotListItem";
import JotForm from "./JotForm";
import { IoAdd } from "react-icons/io5";
import { isToday, startOfToday, sub } from "date-fns";

type JotListProps = {
    date?: Date
    daysAgo?: number
}

const fetcher: Fetcher<(DailyList & { jots: Jot[]}), string> = ( url:string ) => axios.get(url).then(res => res.data);

const JotList: FC<JotListProps> = ({ date=new Date(), daysAgo=0 }) => {

    const today = startOfToday();
    const listDate = sub(today, { days: daysAgo});

    const [newJotFormVisible, setNewJotFormVisible] = useState<boolean>(false);
    const [jots, setJots] = useState<Jot[]>([]);

    const { data } = useSWR(`/api/jots?daysAgo=${daysAgo}`, fetcher);
    const { mutate } = useSWRConfig(); 

    useEffect(() => {
        if(data) {
            setJots(data.jots)
        }
    }, [data])

    const addJot = async (values: Partial<Jot>) => {
        const newJot = await axios.post('/api/jots', values).then(res => res.data)
        mutate(
            '/api/jots',
            setJots([...jots, newJot]),
            {
                optimisticData: newJot,
                rollbackOnError: true
            }
        )
    }

    const closeForm = () => setNewJotFormVisible(false);
    const openForm = () => setNewJotFormVisible(true)

    return (
        <section data-testid="section">
            <DateHeader date={listDate}/>

            {jots && jots.map((jot: Jot) => {
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

            {!newJotFormVisible && isToday(listDate) && (
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