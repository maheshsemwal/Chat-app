import React, { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Example() {
    const {user} = ChatState();
    const history = useHistory();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const openProfileModal = () => {
        setProfileModalOpen(true);
    };

    const closeProfileModal = () => {
        setProfileModalOpen(false);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push("/");
    }
    return (
        <>
        <Disclosure as="nav" className=" px bg-gray-800">
            {({ open }) => (
                <>
                    <div className="max-w-8xl px-2 sm:px-6 lg:px-8">
                        <div className=" relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            </div>

                            <div className="m-auto flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <div className="flex items-center justify-center">
                                            <img
                                                className="h-8 w-auto"
                                                src="https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Chat-2-1024.png"
                                                alt="Your Company"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={user.profilePic}
                                                alt=""
                                                name={user.name}
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-cyan-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={classNames(active ? ' bg-cyan-900' : '', 'block px-4 py-2 text-sm text-white w-full rounded-md')}
                                                        onClick={openProfileModal}
                                                    >
                                                        Your Profile
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        
                                                        className={classNames(active ? 'bg-cyan-900' : '', 'block px-4 py-2 text-sm text-white w-full rounded-md')}
                                                    >
                                                        Settings
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        
                                                        className={classNames(active ? 'bg-cyan-900' : '', 'block px-4 py-2 text-sm text-white w-full rounded-md')}
                                                        onClick={logoutHandler}
                                                    >
                                                        Log out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
        {isProfileModalOpen && <ProfileModel user={user} onClose={closeProfileModal} />}
        </>
    );
}
