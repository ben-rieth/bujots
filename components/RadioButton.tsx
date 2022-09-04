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
            className="flex items-center justify-center px-1"
        >
            <Field type="radio" name={setName} value={value} className="hidden" disabled={disabled} />
            <p className={
                `py-1 px-2 w-16 text-center cursor-pointer rounded text-sm
                ${currentValue === value && "bg-white"}
            `}>{value}</p>
        </label>
    )
}

export default RadioButton;