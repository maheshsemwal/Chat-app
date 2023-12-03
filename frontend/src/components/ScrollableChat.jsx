import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';

import { ChatState } from '../context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics';

const ScrollableChat = ({ messages }) => {
    const { user, SelectedChat } = ChatState();

    return (
        <ScrollableFeed forceScroll={true} reverse={true}>
            {messages &&
                messages.map((m, i) => (
                    <div className='flex' key={m._id}>
                        {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <img
                                className="m-2 h-8 w-8 flex-none rounded-full bg-gray-50 cursor-pointer"
                                src={m.sender.profilePic}
                                alt=""
                            />
                        )}
                        <span className={`rounded-lg px-5 py-2 max-w-md m-0.5 mr-1 ml-12 ${m.sender._id === user._id ? "bg-green-500" : "bg-slate-500"}`}
                            style={{
                                marginLeft : isSameSenderMargin(messages, m, i, user._id)
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
