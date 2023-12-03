import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';


const ProfileModel = ({ user, onClose }) => {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  // Reset the modal state when it is closed
  useEffect(() => {
    if (!open) {
      onClose(); // Close the modal and reset the state
    }
  }, [open, onClose]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-32 w-32 rounded-full bg-slate-900 sm:h-20 sm:w-20">
                    {/* Display the user's profile picture */}
                    <img
                      className="h-20 w-20 object-cover rounded-full text-white"
                      src={user.profilePic}
                      alt={user.name}
                    />

                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-2xl leading-6 font-medium text-white">
                      {user.name}
                    </Dialog.Title>
                    <div className="mt-2 text-sm text-gray-500">
                      {/* Display the user's email */}
                      Email: {user.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
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
  );
};

export default ProfileModel;
