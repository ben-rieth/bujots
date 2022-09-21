import { Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { AiOutlineMail } from 'react-icons/ai';

type ConfirmProps = {
    email: string;
    show: boolean;
}

const Confirm:FC<ConfirmProps> = ({ email, show }) => {
    return (
        <Transition appear show={show} as={Fragment} data-testid="confirm">
            <div className="fixed inset-0 z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-white" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="flex items-center justify-center h-full p-8">
                    <div className="overflow-hidden transition-all transform">
                        <h3 className="text-lg font-medium leading-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <AiOutlineMail className="w-12 h-12 shrink-0 text-sky-500" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold">Confirm your email</p>
                        </h3>

                        <p className="mt-4 text-lg text-center">
                        We emailed a magic link to <strong>{email ?? ''}</strong>.
                        <br />
                        Check your inbox and click the link in the email to login or sign
                        up.
                        </p>
                    </div>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    )
}

export default Confirm;