import { startOfToday } from "date-fns";
import { ChangeEvent, FormEvent, useState } from "react";
import { BsExclamationSquareFill, BsFillCalendarEventFill } from 'react-icons/bs';
import * as chrono from 'chrono-node';

import { inputFormat, displayFormat } from "lib/formatDates";
import { useDebouncedCallback } from "use-debounce";
import JotTextInput from "./JotTextInput";

const JotInput = () => {

    const today = startOfToday();

    const [dateChanged, setDateChanged] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const dateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.value === '' || event.target.value === undefined) {
            setSelectedDate(undefined);
            setDateChanged(false);
        } else {
            setSelectedDate(new Date(event.target.value));
            setDateChanged(true);
        }
    }

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        form.reset();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        if (!dateChanged) delete data.date;

        console.log(data);
    }

    return (
        <div className="fixed bottom-14 left-0 right-0 shadow-md-top bg-slate-50 pb-1">
            <form name="new-jot" onSubmit={submitHandler} className="flex flex-col px-3">
                
                <JotTextInput parsedDateHandler={(date: Date) => setSelectedDate(date)}/>
                
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">

                        <select 
                            name="type" 
                            id="type-select"
                            className="text-sm py-2 bg-slate-50"
                        >
                            <option value="NOTE">Note</option>
                            <option value="TASK">Task</option>
                            <option value="EVENT">Event</option>
                        </select>

                        <label htmlFor="is-important">
                            <input 
                                type="checkbox" 
                                name="important" 
                                id="is-important" 
                                className="hidden peer"
                            />
                            <BsExclamationSquareFill data-testid="important" className="fill-slate-300 peer-checked:fill-rose-500 w-5 h-5"/>
                        </label>
                            
                        <label htmlFor="date" className="relative">

                            <input 
                                min={inputFormat(today)}
                                type="datetime-local" 
                                name="date" 
                                id="date" 
                                className="absolute left-0 top-0 w-full h-full opacity-0"
                                onChange={dateChangeHandler}
                                value={inputFormat(selectedDate)}
                                data-testid="date-input"
                            />
                            <BsFillCalendarEventFill data-testid="calendar" className="fill-slate-500 w-5 h-5"/>
                            
                        </label>
                        
                        {selectedDate && 
                            <>
                                <p className="text-xs" data-testid="date">{displayFormat(selectedDate)}</p>
                            </>
                        }
                    </div>
                    
                    <button className="text-sky-500 font-semibold">Add</button>
                </div>
            </form>

        </div>
        
    )
}

export default JotInput;