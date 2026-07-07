import { useGoogleLogin } from "@react-oauth/google"
import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import AuthMarquee from '../components/AuthMarquee';
import logo from "../assets/logo.svg";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { useAuthStore } from "../store/AuthStore.js"

const Login = () => {
    const [passwordToogle, setPasswordToogle] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login, googleAuth } = useAuthStore();
    const isFormValid = email.trim() !== "" && password.trim() !== "";

    const handleLogIn = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        login(email, password).then(() => {
            navigate('/home');
        })
    }

    const handleGoogleSignIn = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            const { isSuccess, googleAuthError } = await googleAuth(codeResponse.code);

            if (isSuccess) {
                navigate("/home");
            } else if (!isSuccess) {
                toast.error(googleAuthError)
            }
        },
        onError: (error) => {
            console.error("Google Popup Error:", error);
            toast.error("Google Authentication Popup Closed or Failed");
        }
    })

    return (
        <section className='w-full flex-1 flex items-stretch min-h-0'>
            
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-0">
                <div className="absolute inset-0">
                    <AuthMarquee />
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col px-4 py-6 overflow-y-auto">
                <div className="w-full max-w-md m-auto flex flex-col items-center gap-y-5">
                    
                    <div className="w-full sm:flex sm:items-center sm:justify-center gap-x-2 sm:block hidden">
                        <img src={logo} width={40} alt="CineScope logo" />
                        <h1 className="sm:text-3xl text-2xl font-semibold">CineScope</h1>
                    </div>
                    
                    <div className="w-full flex flex-col justify-center items-center gap-y-2">
                        <h1 className="sm:text-4xl text-3xl font-semibold">Welcome back</h1>
                        <p className="text-lg font-semibold dark:text-white/70 text-black/70">Start exploring cinema</p>
                    </div>

                    <form
                        className="w-full h-fit flex flex-col items-center gap-y-4"
                        onSubmit={handleLogIn}
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

                        <div className="w-full flex flex-col gap-y-1">
                            <label htmlFor="password" className="text-sm font-medium dark:text-white/80 text-black/80">
                                Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="password"
                                    type={passwordToogle ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 pr-10 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordToogle(!passwordToogle)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50"
                                >
                                    {passwordToogle ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/forgetPassword")}
                                className="self-end text-sm text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-2 rounded-lg font-semibold text-white transition ${isFormValid
                                ? "bg-[#5fa2fa] hover:bg-[#4b8ee6]"
                                : "bg-[#5fa2fa]/40 cursor-not-allowed"
                                }`}
                        >
                            Login
                        </button>

                        <div className="w-full flex items-center gap-x-2">
                            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                            <span className="text-xs text-black/40 dark:text-white/40">OR</span>
                            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                        </div>

                        <button
                            type="button"
                            onClick={() => handleGoogleSignIn()}
                            className="w-full py-2 rounded-lg border border-black/20 dark:border-white/20 flex items-center justify-center gap-x-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-4 h-4"
                            />
                            Sign in with Google
                        </button>

                        <p className="text-sm dark:text-white/70 text-black/70">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="text-blue-400 hover:underline font-medium"
                            >
                                Register
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login
