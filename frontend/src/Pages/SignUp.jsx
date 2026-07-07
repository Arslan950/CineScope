import { useGoogleLogin } from "@react-oauth/google"
import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import AuthMarquee from "../components/AuthMarquee.jsx"
import logo from "../assets/logo.svg";
import { CheckCheck, EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from 'react-toastify';
import { useAuthStore } from "../store/AuthStore.js"

const SignUp = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login, googleAuth } = useAuthStore();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (savedEmail) {
      setEmail(savedEmail)
      setStep(2);
    }
  }, [])


  const isFormValid = fullName.trim() !== "" && email.trim() !== "" && password.trim() !== "";
  const isOTPValid = OTP.trim() !== "" && OTP.length === 4;

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        "fullName": fullName,
        "email": email,
        "password": password
      });
      sessionStorage.setItem("pendingVerificationEmail", email);
      setStep(2);
      toast("verification email sent")
      setErrorMessage("Success");
    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message
        setErrorMessage(backendMessage)
        toast.error(backendMessage);
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        setErrorMessage(networkMsg);
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        setErrorMessage(unexpectedMsg);
        toast.error(unexpectedMsg);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyOTP`, {
        "email": email,
        "enteredOTP": OTP
      });
      sessionStorage.removeItem("pendingVerificationEmail");
      toast.success("Account verified successfully!");
      login(email, password).then(() => {
        navigate('/onBoarding');
      })
    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message || "Something went wrong";
        setErrorMessage(backendMessage);
        toast.error(backendMessage)
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        setErrorMessage(networkMsg);
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        setErrorMessage(unexpectedMsg);
        toast.error(unexpectedMsg);
      }
    } finally {
      setLoading(false)
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const { isSuccess, googleAuthError } = await googleAuth(codeResponse.code);

      if (isSuccess) {
        navigate("/onBoarding");
      } else if (!isSuccess) {
        toast.error(googleAuthError)
      }
    },
    onError: (error) => {
      console.error("Google Popup Error:", error);
      toast.error("Google Authentication Popup Closed or Failed");
    }
  });

  const handleChangeEmail = () => {
    sessionStorage.removeItem("pendingVerificationEmail");

    setEmail("");
    setPassword("");
    setOTP("");

    setStep(1);
  };

  return (
    <section className="w-full flex-1 flex items-stretch min-h-0 ">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-0">
        <div className="absolute inset-0">
          <AuthMarquee />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col px-4 py-6 overflow-y-auto scrollbar-hide items-center justify-center">
        {loading ? (
          <span className="loading loading-spinner loading-xl"></span>
        ) : (
          <div className="w-full max-w-md m-auto flex flex-col items-center gap-y-5">
            {step === 1 ? (
              <>
                <div className="w-full sm:flex sm:items-center sm:justify-center gap-x-2 sm:block hidden">
                  <img src={logo} width={40} alt="CineScope logo" />
                  <h1 className="sm:text-3xl text-2xl font-semibold">CineScope</h1>
                </div>

                <div className="w-full flex flex-col justify-center items-center gap-y-2 text-center">
                  <h1 className="sm:text-4xl text-3xl font-semibold text-nowrap">Welcome to CineScope</h1>
                  <p className="text-lg font-semibold dark:text-white/70 text-black/70">
                    Register now to begin your cinematic journey
                  </p>
                </div>

                <form
                  className="w-full h-fit flex flex-col items-center gap-y-4"
                  onSubmit={handleRegistration}
                >
                  <div className="w-full flex flex-col gap-y-1">
                    <label htmlFor="fullName" className="text-sm font-medium dark:text-white/80 text-black/80">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

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
                        type={passwordToggle ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordToggle(!passwordToggle)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50"
                      >
                        {passwordToggle ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-2 mt-2 rounded-lg font-semibold text-white transition ${isFormValid
                        ? "bg-[#5fa2fa] hover:bg-[#4b8ee6]"
                        : "bg-[#5fa2fa]/40 cursor-not-allowed"
                      }`}
                  >
                    Sign up
                  </button>

                  <div className="w-full flex items-center gap-x-2 my-1">
                    <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                    <span className="text-xs text-black/40 dark:text-white/40">OR</span>
                    <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleSignUp()}
                    className="w-full py-2 rounded-lg border border-black/20 dark:border-white/20 flex items-center justify-center gap-x-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    Sign up with Google
                  </button>

                  <p className="text-sm dark:text-white/70 text-black/70 mt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="w-full sm:flex sm:items-center sm:justify-center gap-x-2 sm:block hidden">
                  <img src={logo} width={40} alt="CineScope logo" />
                  <h1 className="sm:text-3xl text-2xl font-semibold">CineScope</h1>
                </div>

                <div className="w-full flex flex-col justify-center items-center gap-y-2 text-center">
                  <h1 className="sm:text-4xl text-3xl font-semibold">Verify yourself</h1>
                  <p className="text-lg font-semibold dark:text-white/70 text-black/70">
                    Enter the 4 digit code sent to you
                  </p>
                </div>

                <form
                  className="w-full h-fit flex flex-col items-center gap-y-4"
                  onSubmit={handleVerifyOTP}
                >
                  <div className="w-full flex flex-col gap-y-1">
                    <label htmlFor="enteredOTP" className="text-sm font-medium dark:text-white/80 text-black/80">
                      OTP
                    </label>
                    <input
                      id="enteredOTP"
                      type="text"
                      value={OTP}
                      onChange={(e) => setOTP(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isOTPValid}
                    className={`w-full py-2 mt-2 rounded-lg font-semibold text-white transition ${isOTPValid
                        ? "bg-[#5fa2fa] hover:bg-[#4b8ee6]"
                        : "bg-[#5fa2fa]/40 cursor-not-allowed"
                      }`}
                  >
                    Submit
                  </button>

                  <p className="text-sm dark:text-white/70 text-black/70 mt-2">
                    Wrong email?{" "}
                    <button
                      type="button"
                      onClick={() => handleChangeEmail()}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      Change it here
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default SignUp;