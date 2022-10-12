import { BsExclamationSquareFill, BsFillCalendarEventFill, BsFillClockFill } from 'react-icons/bs';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Jot, Type } from "@prisma/client";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import cuid from 'cuid';
import { dateOnlyFormat } from 'lib/formatDates';
import { parse } from 'date-fns';

type JotFormValues = {
    content: string
    important: boolean
    date: string
    type: Type
}

// TODO: Recreate form with Formik
const JotInput = () => {

    const initialValues: JotFormValues = {
        content: "",
        type: "NOTE",
        important: false,
        date: ""
    }

    const queryClient = useQueryClient();

    const addJotMutation = useMutation(
        (jot) => axios.post('/api/jots', {
            id: jot.id,
            content: jot.content,
            important: jot.important,
            date: jot.date,
            type: jot.type
        }),
        {
            onMutate: async (jot: Jot) => {
                const date = dateOnlyFormat(jot.date)
                //input full fake jot here and then remove attributes in the axios call
                await queryClient.cancelQueries(['jots', date]);

                const previousJots = queryClient.getQueryData<Jot[]>(['jots', date])

                if (previousJots) {
                    queryClient.setQueryData<Jot[]>(['jots', date], [
                        ...previousJots,
                        jot
                    ])
                }
                
                return { previousJots, date, jot };
            },

            onError: (_err, _variables, context) => {
                if(context?.previousJots) {
                    queryClient.setQueryData<Jot[]>(['jots', context?.date], context.previousJots);
                }
            },

            onSettled: (_data, _error, _variables, context) => {
                queryClient.invalidateQueries(['jots', context?.date])
            }
        }
    );

    const submitHandler = (values: FormikValues, actions: FormikHelpers<JotFormValues>) => {

        let datetime;
        if (values.date === "" || values.date === null) {
            datetime = null
        } else {
            datetime = parse(values.date, 'yyyy-MM-dd', new Date());
        }

        const newJot: Jot = {
            id: cuid(),
            content: values.content,
            important: values.important,
            date: datetime,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: values.type,
            status: "ACTIVE"
        }

        addJotMutation.mutate(newJot);

        actions.resetForm();
    }

    return (
        <div className="fixed bottom-14 left-0 right-0 shadow-md-top bg-slate-50 pb-1">
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
            >
               <Form className="flex flex-col px-3" name="new-jot">
                    <div className="relative flex-auto">
                        <Field 
                            type="text"
                            name="content" 
                            id="jot-text"
                            placeholder=" "
                            className="bg-slate-50 border-b-2 border-slate-300  focus:border-sky-500 outline-none px-2 py-1 peer text-base w-full"
                        />
                        <label 
                            htmlFor="jot-text"
                            className="invisible px-1 absolute top-[5px] left-1 text-base text-slate-300 peer-placeholder-shown:visible"
                        >
                            New Jot
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">

                            <Field as="select" name="type" id="type-select" className="text-sm py-2 bg-slate-50">
                                <option value="NOTE">Note</option>
                                <option value="TASK">Task</option>
                                <option value="EVENT">Event</option>
                            </Field>

                            <label htmlFor="is-important">
                                <Field
                                    type="checkbox" 
                                    name="important" 
                                    id="is-important" 
                                    className="hidden peer"
                                />
                                <BsExclamationSquareFill data-testid="important" className="fill-slate-300 peer-checked:fill-rose-500 w-5 h-5"/>
                            </label>

                            <label htmlFor="date" className="relative">

                                <Field 
                                    type="date"
                                    name="date"
                                    id="date"
                                    className="absolute left-0 top-0 w-full h-full opacity-0"
                                    data-testid="date-input"
                                />
                                <BsFillCalendarEventFill data-testid="calendar" className="fill-slate-500 w-5 h-5"/>
                            </label>

                            {/* <label htmlFor="time" className="relative">
                                <Field 
                                    type="time"
                                    name="time"
                                    id="time"
                                    className="absolute left-0 top-0 w-full h-full opacity-0"
                                />
                                <BsFillClockFill data-testid="clock" className="fill-slate-500 w-5 h-5"/>
                            </label> */}

                        </div>

                        <button className="text-sky-500 font-semibold" type="submit">Add</button>
                    </div>
                </Form> 
            </Formik>
        </div>
        
    )
}

export default JotInput;