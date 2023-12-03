import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideBar from '../components/miscellaneous/SideBar'
import Chat from '../components/Chat'
import ChatBox from '../components/ChatBox'
import NavBar from '../components/miscellaneous/NavBar'
const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%", color: "white" }}>
            {user && <NavBar />}
            {user && <SideBar />}
            <div className='flex' style={{height:"82vh",}}>
                {user && <Chat fetchAgain={fetchAgain} className="flex-shrink-0" />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} className="flex-shrink-0 bg-red-500" />}
            </div>

        </div>
    )
}

export default ChatPage
