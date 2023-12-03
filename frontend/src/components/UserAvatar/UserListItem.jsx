import React from 'react'
  
const UserListItem = ({user, handleFunction}) => {
    return (
      <ul role="list" className="divide-y divide-gray-100"> 
        <li className="flex justify-between gap-x-6 py-5 border-b-2 border-slate-500"
        onClick={handleFunction}
        >
          <div className="flex h-8 min-w-0 gap-x-4 hover:bg-slate-900">
            <img className="h-10 w-10 flex-none rounded-full bg-gray-50" src={user.profilePic} alt="" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-white">{user.name}</p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
            </div>
          </div>
        </li>
    </ul>
  )
}

export default UserListItem
