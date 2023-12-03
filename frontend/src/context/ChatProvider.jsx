import { set } from "mongoose";
import { createContext, useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [SelectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    const history = useHistory();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if(userInfo){
            setUser(userInfo);
        } else {
            // If userInfo is not available, you might want to redirect to the login page
            history.push('/');
        }
    }, [history]);
    

    return <ChatContext.Provider value={{user, setUser, SelectedChat, setSelectedChat, chats, setChats}}>{children}</ChatContext.Provider>;
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;
