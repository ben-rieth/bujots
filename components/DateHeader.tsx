import { FC } from "react";

type DateHeaderProps = {
    date?: Date
}

const DateHeader : FC<DateHeaderProps> = ({date = new Date()}) => {

    const dateString = date.toLocaleDateString(
        undefined,
        {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )

    return (
        <h1>{dateString}</h1>
    )
}

export default DateHeader;