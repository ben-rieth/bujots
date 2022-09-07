import { Form, Formik, FormikValues, Field, useFormikContext } from "formik";
import * as Yup from 'yup';
import { FC, forwardRef, KeyboardEvent, RefObject, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoEllipseOutline, IoRemove, IoTriangleOutline, IoArrowUndoCircle } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiDeleteBinLine } from "react-icons/ri";
import { BsExclamationCircleFill } from 'react-icons/bs';
import useDetectOutsideClick from "hooks/useDetectOutsideClick";
import RadioButton from "../RadioButton";

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

const ContentInputField = (props : {values: FormikValues, disabled: boolean}) => {
    const {
        values,
        disabled
    } = props;
    
    return (
        <Field 
            type="text" 
            name="content" 
            placeholder="This is a Jot!"
            disabled={disabled || values.status === "DELETED"}
            className={`
                flex-auto text-lg border-b-2 outline-none border-slate-300 focus:border-cyan-500
                ${values.status === "DELETED" && "line-through decoration-from-font"}
            `}
        />

    )
}

const TypeRadioGroup = (props: {values: FormikValues, disabled: boolean}) => {
    const {
        values,
        disabled
    } = props;

    return (
        <fieldset role="radiogroup" className="flex items-center p-1 mx-auto divide-x rounded divide-slate-400 bg-slate-200 w-fit">
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
    )
}

const JotForm:FC<JotFormProps> = ({ initialValues=undefined, onSubmit, done = () => { /* empty function */ } }) => {

    const [disabled, setDisabled] = useState<boolean>(false);
    const formikRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = async (values: FormikValues) => {
        try {
            setDisabled(true);

            values.type = values.type.toUpperCase();
            values.status = values.status.toUpperCase();
            await onSubmit(values)

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
                {({ values, setFieldValue, handleSubmit, dirty, isSubmitting }) => (
                    <Form 
                        ref={formikRef}
                        name="new-jot-form"
                        className="relative flex flex-col gap-2"
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

                            <ContentInputField values={values} disabled={disabled}/>
                            
                            {initialValues ? (
                                <label>
                                    {values.status === "DELETED" &&
                                        <IoArrowUndoCircle 
                                            data-testid="undo"
                                            className="w-6 h-6 fill-sky-500"
                                            onClick={() => {
                                                setFieldValue("status", "ACTIVE")
                                                handleSubmit()
                                            }}
                                        />
                                    }
                                    {values.status === "ACTIVE" &&
                                        <RiDeleteBinLine 
                                            data-testid="delete"
                                            className="w-6 h-6 fill-rose-500"
                                            onClick={() => {
                                                setFieldValue("status", "DELETED")
                                                handleSubmit()
                                            }}
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
                        {(values.status !== "DELETED" && initialValues?.status !== "DELETED") &&
                            <TypeRadioGroup disabled={disabled} values={values} />
                        }
                        
                        {isSubmitting && 
                            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-3xl">
                                <AiOutlineLoading3Quarters className="w-8 h-8 fill-sky-500 animate-spin"/>
                            </div>
                        }
                        
                        <OutsideClickSubmit ref={formikRef} done={done} />
                    </Form>
                )}

            </Formik>
        </div>
    )
}

export default JotForm;