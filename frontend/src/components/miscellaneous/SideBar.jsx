import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';

// Custom CSS to hide the scrollbar
const scrollbarHiddenCSS = `
  .scrollbar-hidden::-webkit-scrollbar {
    width: 0.5em;
  }

  .scrollbar-hidden::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const toggleDialog = () => {
    setOpen(!open);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  

  const handleSearch = async(query) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResults(data);
    }
    catch (e) {
      console.log(e);
      toast.error('Failed to load search results!');

    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <style>{scrollbarHiddenCSS}</style>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden "
          onClose={closeDialog}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0 bg-black opacity-30"
              onClick={closeDialog}
            />
          </Transition.Child>
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform ease-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-slate-900 py-6 shadow-xl scrollbar-hidden">
                  <div className="flex justify-end pr-4">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={closeDialog}
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="px-4 sm:px-6">
                    <label htmlFor="email" className="text-base font-semibold leading-6 text-white">
                      Search
                    </label>
                    <div className='flex align-middle'>
                      <input
                        placeholder='Enter Name or Email'
                        onChange={(e) => handleSearch(e.target.value)}
                        className="block px-5 w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                    {/* Your content */}
                    {loading ? (
                      <ChatLoading />
                    ) : (
                      searchResults?.map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      ))
                    )}
                  </div>
                </div>
                {loadingChat && <ChatLoading />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Open Dialog button */}
      <button
        onClick={toggleDialog}
        className="fixed top-4 left-4 text-white px-4 py-2 rounded-md"
      >
        <i className="fa-solid fa-magnifying-glass hover:scale-150"></i>
      </button>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default SideBar;
