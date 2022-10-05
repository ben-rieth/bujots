import { FC } from "react";
import { IoMdArrowForward, IoMdArrowBack} from 'react-icons/io';

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
        <h1 className="text-xl font-bold text-center">
            {dateString}
        </h1> 
    )
}

export default DateHeader;