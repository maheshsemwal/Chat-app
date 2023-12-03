// chatBox.jsx
import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const { selectedChat } = ChatState();

  // Render the ChatBox only if a chat is selected and not on small screens
  return (
    <div className=' w-full'>
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
