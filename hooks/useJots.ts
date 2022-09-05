import { DailyList, Jot } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<(DailyList & { jots: Jot[]}), string> = ( url:string ) => axios.get(url).then(res => res.data);

const useJots = (daysAgo: number) => {
    //const [jots, setJots] = useState<Jot[]>([]);

    const { data, error, mutate } = useSWR(`/api/jots?daysAgo=${daysAgo}`, fetcher);

    const isLoading = !error && !data;

    // useEffect(() => {
    //     if (data) {
    //         setJots(data.jots)
    //     }
    // }, [data]);
    
    return {
        data,
        isLoading,
        isError: error,
        mutate
    }
}

export default useJots;