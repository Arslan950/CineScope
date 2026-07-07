import React, { useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import AuthMarquee from '../../components/AuthMarquee';
import { CheckCheck, Loader, Loader2Icon } from "lucide-react";
const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const isFormValid = email.trim() !== "";

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forget-password`, {
                "email": email
            });
            toast("Email sent to your inbox")
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="w-full flex-1 flex items-stretch min-h-0">

            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-0">
                <div className="absolute inset-0">
                    <AuthMarquee />
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col px-4 py-6 overflow-y-auto items-center justify-center">
                {
                    (loading) ? (<span className="loading loading-spinner loading-xl"></span>
                    ) : (<div className="w-full max-w-md m-auto flex flex-col items-center gap-y-6">

                        <div className="w-full flex flex-col justify-center items-center gap-y-2 text-center">
                            <h1 className="sm:text-3xl text-2xl font-semibold">Enter your registered mail</h1>
                        </div>

                        <form
                            className="w-full h-fit flex flex-col items-center gap-y-4"
                            onSubmit={handleForgetPassword}
                        >
                            <div className="w-full flex flex-col gap-y-1">
                                <label htmlFor="email" className="text-sm font-medium dark:text-white/80 text-black/80">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full py-2 mt-2 rounded-lg font-semibold text-white transition ${isFormValid
                                    ? "bg-[#5fa2fa] hover:bg-[#4b8ee6]"
                                    : "bg-[#5fa2fa]/40 cursor-not-allowed"
                                    }`}
                            >
                                Submit
                            </button>
                        </form>
                    </div>)
                }
            </div>
        </section>
    )
}

export default ForgetPassword
