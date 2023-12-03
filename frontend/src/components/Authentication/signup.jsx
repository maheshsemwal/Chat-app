import { set } from 'mongoose'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import {useHistory} from 'react-router-dom'

function signup() {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [profilePic, setProfilePic] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const postDetails = async (pics) => {
    setLoading(true)
    if (pics == undefined) {
      toast.error('Please upload a picture!');
      setLoading(false); // You might want to stop loading if there's an error
      return;
    }
    try {
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "Chat-app");
        data.append("cloud_name", "dh8fvd8ow");

        const response = await fetch("https://api.cloudinary.com/v1_1/dh8fvd8ow/image/upload", {
          method: "post",
          body: data,
        });

        if (!response.ok) {
          // Handle non-successful response (HTTP error)
          throw new Error(`Image upload failed with status ${response.status }`);
        }

        const Data = await response.json();
        setProfilePic(Data.url.toString());
        setLoading(false);
        toast.success('Image upload successful!');
      } else {
        toast.error('Please upload a picture!');
        setLoading(false);
      }

    }
    catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed. Please try again.');
      setLoading(false);
    }
  }

  const submitHandler = async(  ) => {
      setLoading(true)
      if(!name || !email || !password || !confirmPassword){
        toast.error('Please fill all the fields!');
        setLoading(false)
        return
      }
      if(password !== confirmPassword){
        toast.error('Passwords do not match!');
        setLoading(false)
        return
      }
      try{
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          }
          const {data} = await axios.post("/api/user",{name,email,password,profilePic},config)
          toast.success('Account created successfully!');
          localStorage.setItem("userInfo",JSON.stringify(data))
          setLoading(false)
          history.push('/chats')
      }catch(error){
        toast.error(error.response.data.message);
        setLoading(false)
      }
   }

  return (
    <div className="max-w-fit px-20 py-10 bg-slate-950 rounded-3xl border-solid border-2 border-sky-500">
      <div className="bg-slate-950 sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto my-0 h-10 w-auto"
          src="https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Chat-2-1024.png"
          alt="Your Company"
        />
        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-slate-50">
          Create New Account
        </h2>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="name" className='block text-sm font-medium leading-6 text-slate-50'>
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-50">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-50">
                  Create Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-50">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="Cpassword"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="profilePic">Upload Profile Photo</label>
              <div className="mt-2">
                <input
                  id="profilePic"
                  name="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                onClick={submitHandler}
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Uploading......' : 'Create'}
              </button>
            </div>

          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  )
}

export default signup