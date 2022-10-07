import { format } from 'date-fns';

const displayFormat = (date: Date) => {
    return format(date, "MM/dd/yy h:mmaa");
}

const inputFormat = (date: Date | undefined) => {
    if (!date) return;

    return format(date, "yyyy-MM-dd'T'hh:mm")
}

const dateOnlyFormat = (date: Date | null) => {

    if (!date) return null;
    
    return format(date, 'yyyy-MM-dd');
}

export {
    displayFormat,
    inputFormat,
    dateOnlyFormat
}