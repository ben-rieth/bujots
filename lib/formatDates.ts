import { format } from 'date-fns';

const displayFormat = (date: Date) => {
    return format(date, "MM/dd/yy h:mmaa");
}

const inputFormat = (date: Date | undefined) => {
    if (!date) return;

    return format(date, "yyyy-MM-dd'T'hh:mm")
}

export {
    displayFormat,
    inputFormat
}