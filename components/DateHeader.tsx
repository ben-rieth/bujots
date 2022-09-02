import { FC } from "react";
import { IoArrowBackCircle, IoArrowForwardCircle } from 'react-icons/io5';
import { isToday } from 'date-fns';

type DateHeaderProps = {
    date?: Date
}

const DateHeader : FC<DateHeaderProps> = ({date = new Date()}) => {

    const dateString = date.toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )

    return (
        <div className="grid grid-cols-[1fr_5fr_1fr]">
            <IoArrowBackCircle className="w-7 h-7" data-testid="back"/>
            <h1 className="flex-auto text-xl font-bold text-center">
                {dateString}
            </h1>
            {!isToday(date) && <IoArrowForwardCircle className="w-7 h-7" data-testid="forward"/>}
        </div>
        
    )
}

export default DateHeader;