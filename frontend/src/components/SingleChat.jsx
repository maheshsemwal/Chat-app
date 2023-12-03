import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import { getProfilePic } from '../config/ChatLogics';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import LoadingSpinner from './reactComponents/LoadingSpinner';
import { toast } from 'react-toastify';
import axios from 'axios';
import { set } from 'mongoose';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';


const ENDPOINT = "http://localhost:5000";  //change it in the time of deployment

var socket, selectedChatCompare; 



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, SelectedChat, setSelectedChat } = ChatState();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isUpdateGroupChatModalOpen, setUpdateGroupChatModalOpen] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();

    const fetchMessages = async () => {
        if (!SelectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${SelectedChat._id}`, config);

            console.log(messages);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", SelectedChat._id);

        } catch (error) {
            toast.error(error.message);
        }
    }

    const sendMessage = async () => {
        if (newMessage) {
            try {
                const config = {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: SelectedChat._id,
                }, config);
                console.log(data);
                
                socket.emit('new message', data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on('connection', () => setSocketConnected(true));
   },[]);

   useEffect(() => {
        fetchMessages();

        selectedChatCompare = SelectedChat;

    }, [SelectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                toast.info(`New message from ${getSender(user, newMessageRecieved.chat.users)}`);
            }
            else{
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });


    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        //Typing indicator
    }



    const openProfileModal = () => {
        setProfileModalOpen(true);
    };

    const closeProfileModal = () => {
        setProfileModalOpen(false);
    };

    const openUpdateGroupChatModal = () => {
        setUpdateGroupChatModalOpen(true);
    };

    const closeUpdateGroupChatModal = () => {
        setUpdateGroupChatModalOpen(false);
    };

    return (
        <>
            {SelectedChat ? (
                // Render content when a chat is selected
                <div className=" flex flex-col h-full w-full lg:w-full xl:w-full">
                    <div className="bg-slate-950  text-white p-3 flex justify-between items-center">
                        <button
                            className="flex md:hidden items-center text-lg font-bold"
                            onClick={() => setSelectedChat("")}
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        {!SelectedChat.isGroupChat ? (
                            <>
                                <div className="flex items-center">
                                    <img
                                        className="h-12 w-12 flex-none rounded-full bg-gray-50 cursor-pointer"
                                        src={getProfilePic(user, SelectedChat.users)}
                                        alt=""
                                        onClick={openProfileModal}
                                    />
                                    <div className="ml-3">
                                        <p className="text-lg font-semibold">{getSender(user, SelectedChat.users)}</p>
                                        {/* Add additional info if needed */}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center text-lg font-semibold">
                                <img
                                    className="h-12 w-12 mr-3 flex-none rounded-full bg-gray-50 cursor-pointer"
                                    src="https://th.bing.com/th/id/R.c3dc17cf8cab4b0efa85ccebc43f2056?rik=u4mLPlD7L6LB4w&riu=http%3a%2f%2fedaethiopia.org%2fimages%2fmenu%2fflaticon-22.png&ehk=cWajdupjK30Z%2fSOSw6ihwmwHfWzOYcH0mTUVHLXkQxc%3d&risl=&pid=ImgRaw&r=0"
                                    alt=""
                                    onClick={openUpdateGroupChatModal}
                                />
                                {/* <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onClick={openUpdateGroupChatModal}/> */}
                                {SelectedChat.chatName.toUpperCase()}


                            </div>
                        )}
                    </div>
                    <div className='bg-slate-900 h-full w-full relative'>
                        {loading ? (
                            <div className='flex justify-center items-center' style={{height:"82vh"}}>
                            <LoadingSpinner size={50}/>
                             </div>
                        ) : (
                            <div 
                                 style={{ height: '71.5vh' }}
                            >
                            <ScrollableChat messages={messages} />
                          </div>
                          
                        )}


                        <div className="sticky bg-slate-800 bottom-0 left-0 right-0 p-4 flex items-center justify-between max-w-screen">
                            {/* Input goes here */}
                            <input
                                className="flex-grow p-2 border-none bg-transparent focus:outline-none text-white max-w-full mx-2"
                                type="text"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={typingHandler}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                required
                            />
                            <button className="ml-2 text-white p-2 rounded" onClick={sendMessage}>
                                <i className="fa-solid fa-circle-chevron-right text-2xl hover:text-blue-400"></i>
                            </button>
                        </div>
                    </div>


                </div>
            ) : (
                // Render content when no chat is selected
                <div className="flex flex-col justify-center items-center h-full">
                    <img src="https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Chat-2-1024.png" alt="Chat" className="w-1/4" />
                    <h1 className="text-2xl font-bold">Welcome to Chat</h1>
                    <p className="text-gray-500">Please select a chat to start messaging</p>
                </div>
            )}
            {isProfileModalOpen && <ProfileModel user={getSenderFull(user, SelectedChat.users)} onClose={closeProfileModal} />}
            {isUpdateGroupChatModalOpen && <UpdateGroupChatModel onClose={closeUpdateGroupChatModal} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>}
        </>
    );
};

export default SingleChat;
