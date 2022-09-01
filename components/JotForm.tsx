import { Form, Formik, FormikValues, Field, useFormikContext } from "formik";
import * as Yup from 'yup';
import { FC, forwardRef, KeyboardEvent, RefObject, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoEllipseOutline, IoRemove, IoTriangleOutline, IoArrowUndoCircle } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsExclamationCircleFill } from 'react-icons/bs';
import { Status, Type } from "@prisma/client";
import useDetectOutsideClick from "hooks/useDetectOutsideClick";
import { doesNotMatch } from "assert";
import RadioButton from "./RadioButton";

type JotFormProps = {
    onSubmit: (values: FormikValues) => Promise<void>
    done?: () => void
    initialValues?: JotFormInitialValues
}

type JotFormInitialValues = {
    content: string;
    type: string;
    status: string;
    important: boolean
}


const OutsideClickSubmit = forwardRef<HTMLFormElement, {done: () => void}>((props, ref) => {
    const { dirty, submitForm } = useFormikContext();

    const outsideClickHandler = () => {
        if (dirty) {
            submitForm()
        } else {
            props.done()
        }
    }

    useDetectOutsideClick(ref as RefObject<HTMLFormElement>, outsideClickHandler)

    return null;
});

OutsideClickSubmit.displayName = "OutsideClickSubmit";

const JotForm:FC<JotFormProps> = ({ initialValues=undefined, onSubmit, done = () => { /* empty function */ } }) => {

    const [disabled, setDisabled] = useState<boolean>(false);
    const formikRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = async (values: FormikValues) => {
        try {
            setDisabled(true);

            values.type = values.type.toUpperCase();
            values.status = values.status.toUpperCase();
            await onSubmit(values)

            if (initialValues === undefined) {
                toast.success("New Jot Added!")
            } else {
                toast.success("Jot Edited!")
            }

            console.log("submit")
            done();

        } catch (err) {
            setDisabled(false)
            toast.error("Error adding Jot")
        }
    }

    const initialFormValues = initialValues ?? {
        content: '',
        type: 'NOTE',
        important: false,
        status: "ACTIVE"
    } 

    return(
        <div className="py-1">
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleFormSubmit}
                validationSchema={Yup.object({
                    content: Yup.string().required('Jot Text Required'),
                    type: Yup.string().required('Must choose jot type'),
                    important: Yup.boolean(),
                    status: Yup.string()
                })}
            >
                {({ values, setFieldValue, handleSubmit, dirty }) => (
                    <Form 
                        ref={formikRef}
                        name="new-jot-form"
                        className="flex flex-col gap-2"
                        onKeyDown={(event: KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                dirty ? handleSubmit() : done()
                            }
                        }}
                    >
                        <div className="flex items-center gap-1">
                            {values.type === "NOTE" && <IoRemove className="w-6 h-6" data-testid="dash"/>}
                            {values.type === "EVENT" && <IoTriangleOutline className="w-6 h-6" data-testid="triangle"/>}
                            {values.type === 'TASK' && <IoEllipseOutline className="w-6 h-6" data-testid="circle"/>}

                            <Field 
                                type="text" 
                                name="content" 
                                placeholder="This is a Jot!"
                                disabled={disabled}
                                className="flex-auto text-lg border-b-2 outline-none border-slate-300 focus:border-cyan-500"
                            />

                            {initialValues ? (
                                <label>
                                    {values.status === "DELETED" &&
                                        <IoArrowUndoCircle 
                                            data-testid="undo"
                                            className="w-6 h-6 fill-sky-500"
                                            onClick={() => setFieldValue("status", "ACTIVE")}
                                        />
                                    }
                                    {values.status === "ACTIVE" &&
                                        <RiDeleteBinLine 
                                            data-testid="delete"
                                            className="w-6 h-6 fill-rose-500"
                                            onClick={() => setFieldValue("status", "DELETED")}
                                        />
                                    }
                                </label>
                            ) : (
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="important"
                                        disabled={disabled}
                                        className="hidden"
                                    />
                                    <BsExclamationCircleFill 
                                        className={`w-6 h-6 ${values.important ? "fill-rose-500" : "fill-slate-300"}`} 
                                        data-testid="important" />
                                </label>
                            )}
                        </div>
                        <fieldset role="radiogroup" className="flex items-center ml-8">
                            <RadioButton 
                                setName="type" 
                                value="EVENT" 
                                currentValue={values.type} 
                                disabled={disabled} />
                            <RadioButton 
                                setName="type" 
                                value="TASK" 
                                currentValue={values.type} 
                                disabled={disabled} />
                            <RadioButton 
                                setName="type" 
                                value="NOTE" 
                                currentValue={values.type} 
                                disabled={disabled}/>
                        </fieldset>
                        <OutsideClickSubmit ref={formikRef} done={done} />
                    </Form>
                )}

            </Formik>
        </div>
    )
}

export default JotForm;