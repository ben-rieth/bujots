import { FC } from "react";
import DateHeader from "./DateHeader";

type DailyListProps = {
    date: Date;
}

const DailyList:FC<DailyListProps> = ({ date }) => {
    return (
        <section>
            <DateHeader date={date}/>
        </section>
    )
}

export default DailyList;