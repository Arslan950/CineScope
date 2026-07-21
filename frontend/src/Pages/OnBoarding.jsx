import React, { useState, useEffect, useRef } from 'react';
import { Camera } from "lucide-react";
import { cinematicAvatars, genres } from "../lib/static-data.js";
import { useCloudinaryImageUpload } from '../hooks/useImageURL.js';
import { useAuthStore } from '../store/AuthStore.js';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import fallBack from "../assets/fallBack.png"

const OnBoarding = () => {

  const { isLoggedIn , editUserInfo } = useAuthStore();

  const navigate = useNavigate();

  const fallBack_url = "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png" || fallBack;
  const [preview, setPreview] = useState(fallBack_url);
  const [step, setStep] = useState(1);

  const { uploadImage, loading, errorMessage, imageUrl } = useCloudinaryImageUpload();

  const fileInputRef = useRef(null);

  const scrollTargetRef = useRef(null);
  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSkip = () => {
    setPreview(fallBack_url);
    setStep(2);
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return

    if (!file.type.startsWith('image/')) return;

    const localpreviewUrl = URL.createObjectURL(file);
    setPreview(localpreviewUrl);

    const uploadedUrl = await uploadImage(file);

    if (uploadedUrl) {
      setPreview(uploadedUrl)
    }
  }

  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (title) => {
    setSelectedGenres((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    editUserInfo(preview, selectedGenres).then(() => {
      navigate("/home");
    })
  }

  return (
    <section ref={scrollTargetRef} className='w-full min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-8 mt-17'>
      {
        (step === 1) ? (
          <div className='w-full max-w-6xl rounded-2xl border border-slate-700 bg-white/70 dark:bg-slate-900/40 px-5 py-8 shadow-xl shadow-slate-950/10 dark:shadow-black/20 sm:px-10 lg:px-16'>
            <div className='flex flex-col items-center gap-y-10'>
              <div className='flex flex-col items-center gap-y-4'>
                <div className='relative'>
                  <div className=' flex items-center justify-center h-36 w-36 rounded-full border-2 border-dashed border-slate-500 bg-slate-200/50 dark:bg-slate-800/70 sm:h-40 sm:w-40'>
                    {loading ? (
                      <span className="loading loading-infinity loading-xl text-blue-500 absolute z-10"></span>
                    ) : null}
                    <img
                      src={preview}
                      alt="Profile"
                      className={`w-full h-full rounded-full object-cover transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}
                    />
                  </div>
                  <input
                    type="file"
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                    ref={fileInputRef}
                  />
                  <button
                    type='button'
                    aria-label='Upload profile photo'
                    onClick={() => fileInputRef.current?.click()}
                    className='absolute bottom-3 right-1 flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-100 text-slate-700 shadow-md transition-colors hover:border-[#5fa2fa] hover:text-[#5fa2fa] dark:bg-slate-900 dark:text-white/80'
                  >
                    <Camera size={18} />
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm font-medium mt-2">{errorMessage}</p>
                )}

                <div className='space-y-2 text-center'>
                  <h1 className='text-2xl font-bold sm:text-4xl'>Set up your profile</h1>
                  <p className='mx-auto max-w-md text-sm font-medium text-slate-600 dark:text-white/60 sm:text-base'>
                    Choose your avatar or uploads of your choice
                  </p>
                </div>
              </div>

              <div className='grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-x-14'>
                {cinematicAvatars.map((avatar) => (
                  <div onClick={() => setPreview(avatar.url)} key={avatar.id} className='flex flex-col items-center gap-y-3'>
                    <img
                      src={avatar.url}
                      alt={avatar.title}
                      className='h-20 w-20 rounded-full border border-slate-600 object-cover shadow-md shadow-slate-950/10 transition-colors hover:border-[#5fa2fa] dark:shadow-black/20 sm:h-24 sm:w-24'
                    />
                    <p className='text-center text-sm font-medium text-slate-700 dark:text-white/70'>{avatar.title}</p>
                  </div>
                ))}
              </div>

              <div className='flex w-full max-w-3xl items-center justify-between gap-x-5 pt-2'>
                <button
                  onClick={handleSkip}
                  type='button'
                  className='w-32 rounded-lg border border-slate-600 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#5fa2fa] hover:text-[#5fa2fa] dark:text-white/80 sm:w-40'
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(2)}
                  type='button'
                  className='w-32 rounded-lg bg-[#5fa2fa] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 sm:w-40'
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full max-w-6xl rounded-2xl border border-slate-700 bg-white/70 px-5 py-8 shadow-xl shadow-slate-950/10 dark:bg-slate-900/40 dark:shadow-black/20 sm:px-10 lg:px-16'>
            <div className='flex flex-col items-center gap-y-10'>
              <div className="text-center">
                <h1 className='mb-2 text-2xl font-semibold sm:text-3xl dark:text-white'>Choose your interests</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pick 3 or more genres to get better recommendations.
                  <span className="ml-2 font-medium text-[#5fa2fa]">
                    ({selectedGenres.length} selected)
                  </span>
                </p>
              </div>
              <div className='grid w-full max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-x-14'>
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.title);

                  return (
                    <button
                      key={genre.title}
                      onClick={() => toggleGenre(genre.title)}
                      type='button'
                      className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${isSelected
                        ? 'border-[#5fa2fa] bg-blue-50 dark:border-[#5fa2fa] dark:bg-[#5fa2fa]/10'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#5fa2fa] text-white shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      <span className='text-4xl transition-transform duration-300 group-hover:scale-110'>{genre.emoji}</span>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${isSelected ? 'text-[#5fa2fa]' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                        {genre.title}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className='flex w-full max-w-3xl items-center justify-between gap-x-5 pt-2'>
                <button
                  onClick={() => setStep(1)}
                  type='button'
                  className='w-32 rounded-lg border border-slate-600 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#5fa2fa] hover:text-[#5fa2fa] dark:text-white/80 dark:hover:text-[#5fa2fa] sm:w-40'
                >
                  Back
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={selectedGenres.length === 0}
                  type='button'
                  className='w-32 rounded-lg bg-[#5fa2fa] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-40'
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section>
  )
}

export default OnBoarding
