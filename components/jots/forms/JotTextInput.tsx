import { ChangeEvent, FC, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as chrono from 'chrono-node';

type JotTextInputProps = {
    parsedDateHandler: (date: Date) => void;
}

const JotTextInput:FC<JotTextInputProps> = ({ parsedDateHandler }) => {

    const [text, setText] = useState<string>("");
    const debounced = useDebouncedCallback(
        (text) => {
            const parsed = chrono.parseDate(text, new Date(), { forwardDate: true});
            if (parsed !== null) {
                parsedDateHandler(parsed);
            }
        },
        500
    );

    const textChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        debounced(event.target.value);
    }

    return (
        <div className="relative flex-auto">
            <input 
                type="text"
                name="content" 
                id="jot-text"
                placeholder=" "
                minLength={1}
                value={text}
                onChange={textChangeHandler}
                className="bg-slate-50 border-b-2 border-slate-300  focus:border-sky-500 outline-none px-2 py-1 peer text-base w-full"
            />
            <label 
                htmlFor="jot-text"
                className="invisible px-1 absolute top-[5px] left-1 text-base text-slate-300 peer-placeholder-shown:visible"
            >
                New Jot
            </label>
        </div>
    )
}

export default JotTextInput;