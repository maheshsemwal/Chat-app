// chat.jsx
import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import { getProfilePic } from '../config/ChatLogics';
import GroupModel from './miscellaneous/GroupModel';
import { useMediaQuery } from 'react-responsive';

const Chat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });


  const openGroupModal = () => {
    setGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setGroupModalOpen(false);
  };

  
  const deselectChat = () => {
    setSelectedChat(null);
    setSelectedChatId(null);
  };

  const fetchChats = async () => {
    try {
      console.log('Fetching chats...');
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log('Chats received:', data);
      setChats(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  


  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    
    // Add event listener for 'Escape' key press
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        deselectChat();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [fetchAgain]);

  return (
    // <div className={`w-full ${selectedChat && isSmallScreen ? 'hidden' : ' sm:block'}`}>
      <div
        className="w-2/6 w-fixed p-5 bg-slate-950 border-red-500 relative overflow-scroll overflow-x-hidden scroll"
        style={{ height: '91.4vh' }}
      >
        <button
          className="w-full absolute top-0 right-0 bg-blue-900 p-2 hover:bg-blue-500"
          onClick={openGroupModal}
        >
          <i className="fa fa-plus" aria-hidden="true"></i> New Group Chat
        </button>
        {chats ? (
          <ul role="list" className="mt-6 p-0 bg-slate-950 relative">
            {chats.map((chat) => (
              <li
              key={chat._id}
                className={`flex justify-between gap-x-6 py-3 pl-2 hover:bg-slate-800 cursor-pointer rounded-md ${
                  selectedChatId === chat._id ? 'bg-slate-800' : ''
                }`}
                onClick={() => {
                  setSelectedChatId(chat._id);
                  setSelectedChat(chat);
                }}
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={!chat.isGroupChat? getProfilePic(loggedUser, chat.users): "https://th.bing.com/th/id/R.c3dc17cf8cab4b0efa85ccebc43f2056?rik=u4mLPlD7L6LB4w&riu=http%3a%2f%2fedaethiopia.org%2fimages%2fmenu%2fflaticon-22.png&ehk=cWajdupjK30Z%2fSOSw6ihwmwHfWzOYcH0mTUVHLXkQxc%3d&risl=&pid=ImgRaw&r=0"}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-white">
                      {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ChatLoading />
        )}
        {isGroupModalOpen && <GroupModel onClose={closeGroupModal} />}
      </div>
    // </div>
  );
};

export default Chat;
