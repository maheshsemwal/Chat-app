import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the delete icon

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <div className='flex items-center justify-center text-center cursor-pointer'>

            <div className="w-fit flex items-center bg-gray-200 rounded-full px-3 py-1 m-1">
                <span className="mr-2">{user.name}</span>
                <FaTimes
                    className="cursor-pointer text-red-500"
                    onClick={handleFunction} // Call the onDelete function with the username when the delete icon is clicked
                />
            </div>
                    </div>
    );
};

export default UserBadgeItem;
