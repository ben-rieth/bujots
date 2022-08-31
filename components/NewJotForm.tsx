import { Type } from "@prisma/client";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import useDetectOutsideClick from "hooks/useDetectOutsideClick";
import { useState, useRef, FC } from "react";
import toast from "react-hot-toast";
import { IoAdd, IoCheckmarkDoneCircle, IoEllipseOutline, IoRemove, IoTriangleOutline } from "react-icons/io5";
import { RiLoader2Fill } from "react-icons/ri";
import * as Yup from 'yup';
import RadioButton from "./RadioButton";

type NewJotFormProps = {
    onSubmit: (values: FormikValues) => Promise<void>
}

const NewJotForm : FC<NewJotFormProps> = ({ onSubmit }) => {

    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleNewJotClick = () => {
        setFormVisible(true)
    }

    const outsideClickHandler = () => {
        setFormVisible(false);
    }

    const ref = useRef(null);
    useDetectOutsideClick(ref, outsideClickHandler);

    const handleFormSubmit = async (values: FormikValues) => {
        try {
            setDisabled(true);

            values.type = values.type.toUpperCase();
            await onSubmit({...values, important: false})

            toast.success("New Jot Added!")

            setFormVisible(false);

        } catch (err) {
            setDisabled(false)
            toast.error("Error adding Jot")
        }
    }

    return (
        <div className="w-fit" ref={ref}>
            {formVisible ? (
                <Formik
                    initialValues={{
                        content: '',
                        type: 'Note'
                    }}
                    onSubmit={handleFormSubmit}
                    validationSchema={Yup.object({
                        content: Yup.string().required('Jot Text Required'),
                        type: Yup.string().required('Must choose jot type')
                    })}
                >
                    {({ isSubmitting, values, isValid }) => (
                        <Form 
                            name="new-jot-form"
                            className="flex flex-col"
                        >
                            <div className="flex items-center gap-1">
                                {values.type === "Note" && <IoRemove className="w-6 h-6" data-testid="dash"/>}
                                {values.type === "Event" && <IoTriangleOutline className="w-6 h-6" data-testid="triangle"/>}
                                {values.type === 'Task' && <IoEllipseOutline className="w-6 h-6" data-testid="circle"/>}
                                <Field 
                                    type="text" 
                                    name="content" 
                                    placeholder="This is a Jot!"
                                    disabled={disabled}
                                    className="text-lg border-b-2 outline-none border-slate-300 focus:border-cyan-500"
                                />
                            </div>
                                
                            <div className="flex justify-between w-12 h-12 gap-2">
                                <fieldset role="radiogroup" className="flex items-center ml-8">
                                    <RadioButton setName="type" value="Event" currentValue={values.type} disabled={disabled}/>
                                    <RadioButton setName="type" value="Task" currentValue={values.type} disabled={disabled}/>
                                    <RadioButton setName="type" value="Note" currentValue={values.type} disabled={disabled}/>
                                </fieldset>

                                <button type="submit" disabled={disabled || values.content.length === 0 || !isValid}>
                                    {isSubmitting ? (
                                        <RiLoader2Fill className="w-10 h-10 outline-none animate-spin fill-cyan-500"/>
                                    ): (
                                        <IoCheckmarkDoneCircle className={`w-12 h-12 ${values.content.length > 0 && isValid ? "fill-green-500" : "fill-slate-300"}`}/>
                                    )}
                                    
                                </button>
                            </div>

                            <ErrorMessage component="span" name="content" className="ml-8 text-xs text-rose-500"/>
                            
                        </Form>
                    )}
                </Formik> 
            ) : (
                <button 
                    className="flex items-center"
                    onClick={handleNewJotClick}
                >
                    <IoAdd data-testid="add" className="w-8 h-8"/>
                    <p className="text-xl">New Jot</p>
                </button>
            )

        }
        </div>
    )
}

export default NewJotForm;