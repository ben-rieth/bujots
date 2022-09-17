import { Formik, Field, Form, ErrorMessage, FormikValues } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import toast from "react-hot-toast";
import AuthTabs from "./AuthTabs";

interface FormValues {
    email: string;
}

const AuthForm = () => {

    const [currentTab, setCurrentTab] = useState<"login" | "register">("register")
    const [disabled, setDisabled] = useState<boolean>(false);

    const changeTab = () => {
        if (currentTab === "login") {
            setCurrentTab("register")
        } else {
            setCurrentTab("login");
        }
    }

    const handleSubmit = async (values: FormikValues) => {
        setDisabled(true);

        const email = values.email
        let toastId;

        try {
            toastId = toast.loading('Loading...');

            await signIn('email', {
                email,
                callbackUrl: '/jots'
            })

            toast.dismiss(toastId);
        } catch (err) {
            toast.error('Unable to sign in', { id: toastId })
        } finally {
            setDisabled(false);
        }
    }

    return (
        <div className="flex flex-col items-center mt-5">
            <h2 className="text-2xl font-bold text-sky-500">
                Welcome to <span className="italic">BuJots</span>!
            </h2>
            <Formik
                initialValues={{ email: ''}}
                onSubmit={handleSubmit}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Email Required')
                })}
            >
                {({  }) => (
                    <>
                        <Form
                            className="flex flex-col gap-5 mt-5"
                            name="auth-form"
                        >
                            <AuthTabs disabled={disabled} onTabChange={changeTab}/>

                            <div className="relative flex flex-col">
                                <label htmlFor="email" className="absolute px-1 bg-white left-2 -top-3">
                                    Email
                                    <span className="text-rose-500">*</span>
                                </label>
                                <Field 
                                    disabled={disabled}
                                    className="w-64 pt-3 pb-2 pl-3 border-2 rounded-lg outline-none border-slate-300 focus:border-sky-500"
                                    type="email"
                                    name="email"
                                    id="email"
                                />
                                <ErrorMessage 
                                    component="span"
                                    name="email" 
                                    data-testid="error"
                                    className="text-sm text-rose-500" />
                            </div>

                            <button 
                                disabled={disabled}
                                type="submit"
                                className="py-2 font-medium bg-white border-2 rounded-lg border-sky-500 text-sky-500 hover:text-white hover:bg-sky-500"
                            >
                                {currentTab === "register" ? "Sign Up" : "Sign In"}
                            </button>
                        </Form>
                    </>
                )}
                
            </Formik>
            
        </div>
    );
}

export default AuthForm;