import { Menu, Transition } from '@headlessui/react';
import { Burger } from '@mantine/core';
import { User } from '@prisma/client';
import { FC, Fragment } from 'react';

type HeaderMenuProps = {
    user: User | undefined
}

const HeaderMenu:FC<HeaderMenuProps> = ({ user }) => {
    if (user) {
        return (
            <Menu as="div" className="relative">
                {({ open }) => (
                    <>
                        <Menu.Button as="div">
                            <Burger opened={open}/>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg w-44 divide-slate-300">
                                <Menu.Item as="div" className="px-2">
                                    {({ active }) => (
                                        <p>Log Out</p>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        )
    }

    return null;
}

export default HeaderMenu;