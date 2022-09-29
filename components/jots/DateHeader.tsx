import { FC } from "react";
import { IoMdArrowForward, IoMdArrowBack} from 'react-icons/io';

type DateHeaderProps = {
    date?: Date
    onBackClick?: () => void
    onForwardClick?: () => void
}

const DateHeader : FC<DateHeaderProps> = ({date = new Date(), onBackClick, onForwardClick}) => {

    const dateString = date.toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )

    return (
        <div className="flex items-center justify-center gap-3 pt-2">
            <IoMdArrowBack 
                data-testid="left" 
                className="fill-sky-500 w-6 h-6"
                onClick={onBackClick}
            />
            <h1 className="text-xl font-bold text-center">
                {dateString}
            </h1>
            <IoMdArrowForward 
                data-testid="right" 
                className="fill-sky-500 w-6 h-6"
                onClick={onForwardClick}
            />
        </div>
        
        
    )
}

export default DateHeader;