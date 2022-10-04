import { startOfToday } from "date-fns";
import { ChangeEvent, FormEvent, useState } from "react";
import { BsExclamationSquareFill, BsFillCalendarEventFill } from 'react-icons/bs';
import { IoEllipse, IoEllipseOutline, IoRemove, IoTriangle, IoTriangleOutline } from "react-icons/io5";

import { inputFormat, displayFormat } from "lib/formatDates";

const JotInput = () => {

    const today = startOfToday();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
    const [dateChanged, setDateChanged] = useState<boolean>(false);
    const [type, setType] = useState<string>("TASK");

    const dateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!dateChanged) setDateChanged(true);

        if (event.target.value === '' || event.target.value === undefined) {
            setSelectedDate(undefined);
            setDateChanged(false);
        } else {
            setSelectedDate(new Date(event.target.value));
        }
    }

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!dateChanged) delete data.date;

        console.log(data);
    }

    return (
        <div className="fixed bottom-16 left-0 right-0 bg-white">
            
            <form name="new-jot" onSubmit={submitHandler} className="flex flex-col px-3">
                <div className="flex gap-2 items-center">

                    <div className="relative flex-auto">
                        <input 
                            type="text"
                            name="jot-text" 
                            id="jot-text"
                            placeholder=" "
                            minLength={1}
                            className="border-b-2 border-slate-300  focus:border-sky-500 outline-none px-2 py-1 peer text-base w-full"
                        />
                        <label 
                            htmlFor="jot-text"
                            className="invisible px-1 absolute top-[5px] left-1 text-base text-slate-300 peer-placeholder-shown:visible"
                        >
                            New Jot
                        </label>
                    </div>
                </div>
                
                
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">

                        <select 
                            name="type" 
                            id="type-select"
                            className="text-sm py-2"
                            value={type}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) => setType(event.target.value)}
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
                        
                        {selectedDate && dateChanged && 
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