import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem';
import { set } from 'mongoose';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { config } from 'dotenv';

const GroupModel = ({ onClose }) => {
  const [open, setOpen] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const cancelButtonRef = useRef(null);

  const { user, chats, setChats } = ChatState();
  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open, onClose]);

  const handleSubmit = async() => {
    if(!groupName || !selectedUsers) {
      toast.warning("Please enter group name and select users");
      return;
    }
    try {
      const config = {  
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat/group`, {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((u)=>u._id)),
      }, config);
      setChats([data, ...chats]);
      toast.success("Group Created");
    } catch (e) {
      toast.error(e.message);
    }
    setOpen(false);
  };

  const handleGroup = (userToAdd) =>{
    if(selectedUsers.includes(userToAdd._id)) {
      toast.error("User already added");
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }
  const handleDelete = (userToDelete) =>{
    setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== userToDelete._id));
  }


  const handleSearch = async(query) => {
    setSearch(query);
    if(!query) {

      return;
    }

    try {
      setLoading(true);
      const config = {  
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);
      setSearchResults(data);
      setLoading(false);

    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Transition.Root show={open}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
              <div className="bg-slate-800 p-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="mt-4 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="flex text-2xl leading-6 font-medium text-white">
                      Group Name
                      <input
                        id="groupName"
                        name="groupName"
                        type="text"
                        placeholder='Enter Group Name'
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                        className="mx-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </Dialog.Title>
                    <div className="mt-4 text-sm text-gray-500">
                      Search Users:
                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          placeholder="Search... eg: John Doe, Alan"
                          value={search}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                          {/* <button
                            type="button"
                            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSearch}
                          >
                            Search
                          </button> */}
                      </div>
                    </div>
                    <div className='m-2 flex flex-wrap'>

                    {selectedUsers.map(user=>(
                      <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)} />
                      ))}
                    </div>
                    { loading?<div>Loading...</div>:(
                      searchResults?.slice(0,4).map(user=>(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="m-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
                  onClick={handleSubmit}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="m-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
      <ToastContainer position="top-right" autoClose={5000} />
    </Transition.Root>
  );
};

export default GroupModel;
