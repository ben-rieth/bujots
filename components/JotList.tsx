import { Jot, Status, Type } from "@prisma/client";
import { FC, useState } from "react";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from 'axios';
import DateHeader from "./DateHeader";
import JotListItem from "./JotListItem";
import JotForm from "./JotForm";
import { IoAdd } from "react-icons/io5";
import { isToday, startOfToday, sub } from "date-fns";
import JotSkeletonLoader from "./JotSkeletonLoader";

type JotListProps = {
    daysAgo: number
}

const fetcher: Fetcher<Jot[], string> = ( url:string ) => axios.get(url).then(res => res.data);

const JotList: FC<JotListProps> = ({ daysAgo=0}) => {

    const date = sub(startOfToday(), {days: daysAgo})

    const [newJotFormVisible, setNewJotFormVisible] = useState<boolean>(false);

    const { data, error, mutate } = useSWR(`/api/jots?daysAgo=${daysAgo}`, fetcher);
    const loading = !data && !error;

    const addJot = async (values: Partial<Jot>) => {
        
        const tempJot : Jot = {
            important: values.important!,
            status: values.status!,
            type: values.type!,
            content: values.content!,
            id: 'id',
            createdAt: new Date(),
            updatedAt: new Date(),
            date: new Date()
        }

        mutate(
            await axios.post('/api/jots', values),
            {
                optimisticData: [...data!, tempJot],
                rollbackOnError: true
            }
        )
    }

    const closeForm = () => setNewJotFormVisible(false);
    const openForm = () => setNewJotFormVisible(true)

    return (
        <section data-testid="section">
            <DateHeader date={date}/>

            {loading && 
                <>
                    <JotSkeletonLoader />
                    <JotSkeletonLoader />
                    <JotSkeletonLoader />
                    <JotSkeletonLoader />
                </>
            }

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

            {(!newJotFormVisible && isToday(date) && !loading) &&(
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