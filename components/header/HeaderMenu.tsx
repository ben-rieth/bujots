import { Menu, Transition } from '@headlessui/react';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { FC, Fragment } from 'react';

import { FaUserCircle } from 'react-icons/fa';

type HeaderMenuProps = {
    user: User | undefined
}

const HeaderMenu:FC<HeaderMenuProps> = ({ user }) => {
    const logOut = () => {
        signOut({
            callbackUrl: '/'
        })
    }
    
    if (user) {
        return (
            <Menu as="div" className="relative">
                {({ open }) => (
                    <>
                        <Menu.Button as="div">
                            <FaUserCircle className="w-8 h-8 fill-sky-500"/>
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
                                        <p>{user.email}</p>
                                    )}
                                </Menu.Item>
                                <Menu.Item as="div" className="px-2">
                                    {({ active }) => (
                                        <button onClick={() => logOut()}>Log Out</button>
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