import { Jot } from "@prisma/client";
import { FC, useCallback } from "react";
import axios from 'axios';
import DateHeader from "./DateHeader";
import JotListItem from "./JotListItem";
import {startOfToday, sub } from "date-fns";
import JotSkeletonLoader from "./JotSkeletonLoader";
import { useQuery} from "@tanstack/react-query";

type JotListProps = {
    daysAgo: number
}

const JotList:FC<JotListProps> = ({ daysAgo = 0}) => {

    const date = sub(startOfToday(), {days: daysAgo});

    const fetchJots = useCallback(async () => {
        const res = await axios.get(`/api/jots?daysAgo=${daysAgo}`)
        return res.data;
    }, [daysAgo]);

    const { data, status, error } = useQuery(['jots', date], fetchJots)

    return (
        <section className="mb-3">
            {data?.length > 0 && <DateHeader date={date}/>}
            {status === 'success' && (<>
                
                {data.map((jot: Jot) => {
                    return (
                        <div key={jot.id}>
                            <JotListItem jot={jot} isToday={daysAgo === 0}/>
                            <hr />
                        </div>
                    )
                })}
            </>)}

            {status === 'loading' &&(<>
                {Array(4).forEach((_) => <JotSkeletonLoader />)}
            </>)}

            {error instanceof Error && (<>
                <h2>There was an error</h2>
                <p role="alert">{error.message}</p>
            </>)}
        </section>
    )
}

export default JotList;