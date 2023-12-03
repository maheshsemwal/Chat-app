import React, { useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Login from '../components/Authentication/login';
import Signup from '../components/Authentication/signup';
import '../App.css';
import { useHistory } from 'react-router-dom';
const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      history.push('/chats');
    }
  }, [history]);
  return (
    <div className="h-full p-2 m-auto">
      <div className="max-w-max  p-4 rounded-xl">
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-blue-900/20 p-1">
            <Tab className={({ selected }) => `
              w-full py-2.5 text-sm font-medium leading-5 text-blue-100
              ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
              ${selected ? 'bg-slate-950' : 'text-blue-700 hover:bg-white/[0.12] hover:text-white'}
            `}>
              Sign In
            </Tab>
            <Tab className={({ selected }) => `
              w-full py-2.5 text-sm font-medium leading-5 text-blue-100
              ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
              ${selected ? 'bg-slate-950' : 'text-blue-700 hover:bg-white/[0.12] hover:text-white'}
            `}>
              Create Account
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel className="focus:outline-none focus:ring-2">
              <Login />
            </Tab.Panel>

            <Tab.Panel className="focus:outline-none focus:ring-2">
              <Signup />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default HomePage;
