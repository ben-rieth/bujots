import { Field } from "formik";
import { FC } from "react";

type RadioButtonProps = {
    setName: string;
    value: string;
    currentValue: string;
    disabled: boolean;
}

const RadioButton: FC<RadioButtonProps> = ({ setName, value, currentValue, disabled }) => {
    return (
        <label 
            className={`p-1 w-14 text-center outline outline-2 outline-slate-300 cursor-pointer ${currentValue === value && "bg-cyan-500"}`}
        >
            <Field type="radio" name={setName} value={value} className="hidden" disabled={disabled} />
            {value}
        </label>
    )
}

export default RadioButton;