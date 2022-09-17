import { Tab } from "@headlessui/react";
import { FC } from "react";

type AuthTabProps = {
    disabled: boolean
    onTabChange: (index: number) => void
}

const AuthTabs:FC<AuthTabProps> = ({ disabled, onTabChange }) => {

    const tabs = ["Register", "Login"];

    return (
        <Tab.Group onChange={onTabChange}>
            <Tab.List className="flex w-64 p-1 space-x-1 rounded-xl bg-slate-300">
                {tabs.map((tab) => {
                    return (
                        <Tab 
                            disabled={disabled}
                            key={tab}
                            data-testid={tab.toLowerCase()}
                            className={({ selected }) => `
                                w-32 rounded-lg py-2 text-sm font-medium leading-5 text-sky-500
                                ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-500 focus:outline-none focus:ring-2
                                ${selected ? (
                                    'bg-white'
                                ) : (
                                    'text-sky-500/60 hover:bg-white/40 hover:text-white'
                                )}
                            `}
                        >
                            {tab}
                        </Tab>
                    )
                })}
            </Tab.List>
        </Tab.Group>
    )
}

export default AuthTabs;