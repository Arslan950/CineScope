import React, { useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import AuthMarquee from '../../components/AuthMarquee';
import { CheckCheck } from "lucide-react";
const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const isFormValid = email.trim() !== "";

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forget-password`, {
                "email": email
            });
            setErrorMessage("Success")
        } catch (error) {
            if (error.response) {
                const backendMessage = error.response?.data?.message || "Something went wrong";
                setErrorMessage(backendMessage);
                toast.error(backendMessage);
            } else if (error.request) {
                const networkMessage = "Network problem !"
                setErrorMessage(networkMessage);
                toast.error(networkMessage);
            } else {
                const unknownMessage = "Something went wrong (1)";
                setErrorMessage(unknownMessage);
                toast.error(unknownMessage);
            }
        }
    }

    return (
        <section className='flex justify-center items-center w-full h-[810px] '>
            <AuthMarquee />
            <span className='h-full w-1/2 flex justify-center items-center py-20'>
                <div className='w-lg h-[500px] sm:mb-0 mb-20 sm:mt-60'>
                    <div className='space-y-1 mb-6'>
                        <h1 className='sm:text-4xl text-xl font-bold sm:text-left text-center sm:mb-0 mb-4'>Enter Your registered mail</h1>
                    </div>
                    <form onSubmit={handleForgetPassword} className='flex flex-col gap-y-4 sm:w-[80%] w-[100%]'>
                        <div className='flex flex-col gap-y-1.5'>
                            <label htmlFor="email" className='text-sm font-medium dark:text-white/80'>Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                value={email}
                                placeholder='johndoe@gmail.com'
                                className='ring-1 ring-slate-700 focus:ring-[#5fa2fa] focus:outline-none bg-transparent py-2.5 px-3 rounded-lg text-sm transition-all'
                            />
                        </div>
                        <button
                            disabled={!isFormValid}
                            type='submit'
                            className={`${isFormValid ? "bg-[#5fa2fa]" : "bg-[#5fa2fa] cursor-not-allowed"} hover:bg-blue-600 active:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-colors`}
                        >
                            Send Email
                        </button>
                    </form>
                    <p className={`text-green-600 sm:mt-5 flex gap-x-1 ${(errorMessage === "Success") ? "block" : "hidden"}`}>
                        <CheckCheck />
                        An Forget password email has been sent to you
                    </p>
                </div>
            </span>
        </section>
    )
}

export default ForgetPassword
