import { Formik, Field, Form, ErrorMessage, FormikValues } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import toast from "react-hot-toast";
import AuthTabs from "./AuthTabs";
import { FcGoogle } from 'react-icons/fc' 
import Confirm from "./Confirm";

interface FormValues {
    email: string;
}

const AuthForm = () => {

    const [currentTab, setCurrentTab] = useState<"login" | "register">("register")
    const [disabled, setDisabled] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const onTabChange = (index: number) => {
        index === 0 ? setCurrentTab("register") : setCurrentTab("login")
    }

    const handleSubmit = async (values: FormikValues) => {
        setDisabled(true);

        const email = values.email
        let toastId;

        try {
            toastId = toast.loading('Loading...');

            await signIn('email', {
                email,
                callbackUrl: '/jots',
                redirect: false
            });

            setShowConfirm(true);

            toast.dismiss(toastId);
        } catch (err) {
            toast.error('Unable to sign in', { id: toastId })
        } finally {
            setDisabled(false);
        }
    }

    const handleGoogleSignIn = async () => {
        toast.loading('Redirecting...');
        setDisabled(true);

        signIn('google', {
            callbackUrl: '/jots'
        })
    }

    return (
        <div className="flex flex-col items-center mt-5">
            <Formik
                initialValues={{ email: ''}}
                onSubmit={handleSubmit}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Email Required')
                })}
            >
                {({ values }) => (
                    <>
                        <Form
                            className="flex flex-col items-center gap-5 mt-5"
                            name="auth-form"
                        >
                            <h2 className="text-2xl font-bold text-sky-500">
                                Welcome to <span className="italic">BuJots</span>!
                            </h2>
                            <AuthTabs disabled={disabled} onTabChange={onTabChange}/>

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
                                className="w-64 py-2 font-medium bg-white border-2 rounded-lg border-sky-500 text-sky-500 hover:text-white hover:bg-sky-500"
                            >
                                {currentTab === "register" ? "Sign Up" : "Sign In"}
                            </button>
                            <button 
                                disabled={disabled}
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="flex items-center justify-center w-64 gap-2 py-2 border-2 rounded-lg text-sky-500 border-sky-500 hover:text-white hover:bg-sky-500"
                            >
                                <FcGoogle className="w-6 h-6"/>
                                <p className="font-semibold">
                                    {currentTab === "register" ? "Sign Up With Google" : "Sign In With Google"}
                                </p>
                            </button>

                            <Confirm show={showConfirm} email={values.email}/>
                        </Form>
                    </>
                )}
            </Formik>
            
        </div>
    );
}

export default AuthForm;