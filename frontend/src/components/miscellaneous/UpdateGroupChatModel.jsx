import React, { useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import { set } from 'mongoose';
import { toast } from 'react-toastify';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModel = ({ onClose, fetchAgain, setFetchAgain, fetchMessages }) => {
  const cancelButtonRef = useRef(null);
  const [chat, setChat] = useState(/* initial value or null */);
  const [open, setOpen] = useState(true);
  const [chatName, setChatName] = useState('');
  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { user, SelectedChat, setSelectedChat } = ChatState()

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open, onClose]);

  const handleRemove = async(user1) => {
    if(SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toast.error("Only admin can remove users");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const {data} = await axios.put('/api/chat/groupremove',
      {
        chatId : SelectedChat._id,
        userId : user1._id,
      }, config);

      user1._id === user._id ? setSelectedChat(): setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }

  }
  const handleAddUser = async(user1) => {
      if(SelectedChat.users.find((u)=>u._id === user1._id)){
        toast.error("User already added");
        return;
      }
      if(SelectedChat.groupAdmin._id !== user._id){
        toast.error("Only admin can add users");
        return;
      }

      try {
        setLoading(true);  
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.put('/api/chat/groupadd',{
          chatId : SelectedChat._id,
          userId : user1._id,
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (e) {
        toast.error(e.message); 
        setLoading(false);
      }
  }
  const handleRename = async () => {
    if(!groupChatName){
      toast.warning("Please enter group name");
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }, 
      };

      const { data } = await axios.put('/api/chat/rename',
      {charId: SelectedChat._id, 
      chatName: groupChatName
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (e) {
        toast.error(e.message);
        setRenameLoading(false);
        setGroupChatName("");
    }
  }

  const handleSearch = async (query) => {
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
  }
  return (
    <div>
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
              <div className="inline-block align-bottom bg-slate-900 mx-auto rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
                <div className="bg-slate-800 p-8">
                  <div className="flex flex-col items-center justify-center mx-auto">
                    <div className="mt-4 text-center sm:mt-0 sm:text-left mx-auto">
                      <div className=' text-3xl center text-white mx-auto'>
                      {SelectedChat?.chatName}
                      </div>
                      <div className=' text-gray-500'>Members:</div>
                      <div className='m-2 flex flex-wrap'>
                          {SelectedChat?.users.map(user => (
                            <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                          ))}
                        </div>
                      <Dialog.Title as="h6" className="mt-4 flex  text-white">
                        <input
                          id="renameGroupName"
                          name="renameGroupName"
                          type="text"
                          placeholder=' Rename Group Name'
                          value={groupChatName}
                          onChange={(e) => setGroupChatName(e.target.value)}
                          required
                          className="mx-5 block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                          type="button"
                          className=" w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
                          isLoading={renameLoading}
                          onClick={handleRename}
                        >
                          Rename
                        </button>
                      </Dialog.Title>
                      <div className=" ml-5 items-center  text-sm text-gray-500">
                        Search Users:
                        <div className="flex items-center  mt-2">
                          <input
                            type="text"
                            placeholder="Add users... eg: John Doe, Alan"
                            // value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className=" px-4 py-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        
                      </div>
                      <div className='m-2 flex flex-wrap'>

                        
                      </div>
                      { loading?<div>Loading...</div>:(
                      searchResults?.slice(0,4).map(user=>(
                        <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                      ))
                    )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="m-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
                  onClick={()=>{
                    handleRemove(user)
                    setOpen(false)
                  }}
                  >
                    Leave Group
                  </button>
                  <button
                    type="button"
                    className="m-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default UpdateGroupChatModel
