import React, { useState, useRef } from 'react';
import { CheckCircle2, Film, Mail, ShieldAlert, UserRound, Edit, Save, Camera, X } from 'lucide-react';
import { useAuthStore } from "../store/AuthStore.js";
import { useCloudinaryImageUpload } from "../hooks/useImageURL.js"
import { genres } from "../MoviesDB/moviesList.js"
import { toast } from 'react-toastify';
import fallBack from "../assets/fallBack.png"

const fallbackAvatar = "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png" || fallBack;

const Profile = () => {
    const { editUserInfo } = useAuthStore();
    const user = useAuthStore((state) => state.user);
    const isEmailVerified = Boolean(user?.isEmailVerified);
    const initialGenres = Array.isArray(user?.genres) ? user.genres : [];

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.fullName || "");
    const [editedGenres, setEditedGenres] = useState(initialGenres);

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || fallbackAvatar);
    const fileInputRef = useRef(null);

    const { uploadImage, loading, errorMessage, imageUrl } = useCloudinaryImageUpload();

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return
        if (!file.type.startsWith('image/')) return;

        setAvatarPreview(URL.createObjectURL(file));

        const uploadedUrl = await uploadImage(file);

        if (uploadedUrl) {
            setAvatarPreview(uploadedUrl)
        }
    };

    const toggleGenre = (genreTitle) => {
        setEditedGenres(prev =>
            prev.includes(genreTitle)
                ? prev.filter(g => g !== genreTitle)
                : [...prev, genreTitle]
        );
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedName(user?.fullName || "");
        setEditedGenres(initialGenres);
        setAvatarPreview(user?.avatar || fallbackAvatar);
        setAvatarFile(null);
    };

    const handleSave = (e) => {
        e.preventDefault();
        editUserInfo(avatarPreview,editedGenres,editedName);
        toast("Profile updated succesfully")
        setIsEditing(false);
    };

    return (
        <section className='flex w-full flex-grow items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
            <div className='w-full max-w-5xl overflow-hidden rounded-lg border border-slate-300/70 bg-white/80 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900/40 dark:shadow-black/20'>
                <div className='h-28 bg-gradient-to-r from-[#5fa2fa]/35 via-cyan-400/15 to-slate-500/10 dark:from-[#5fa2fa]/25 dark:via-cyan-400/10 dark:to-slate-900'></div>

                <div className='px-5 pb-8 sm:px-8 lg:px-10'>
                    <div className='-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                        <div className='flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left w-full'>
                            <div className={`relative group flex items-center justify-center`}>
                                {
                                    (loading) ? (<span className="loading loading-infinity loading-xl absolute z-10 "></span>) : (null)}
                                < img
                                    src={avatarPreview}
                                    alt={editedName ? `${editedName} avatar` : "Profile avatar"}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                                    className={`h-32 w-32 rounded-full border-4 border-white bg-slate-200 object-cover shadow-lg shadow-slate-950/20 dark:border-slate-900 dark:bg-slate-800 sm:h-36 sm:w-36 ${isEditing ? 'cursor-pointer opacity-80 transition hover:opacity-60' : ''} ${loading ? 'opacity-40' : 'opacity-100'}`}
                                    onClick={handleAvatarClick}
                                />

                                {isEditing ? (
                                    <span className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                                        <Camera className={`text-white drop-shadow-lg" ${loading ? "hidden" : ""}`} size={32} />
                                    </span>
                                ) : (
                                    <span className='absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#5fa2fa] text-white shadow-md dark:border-slate-900'>
                                        <UserRound size={18} />
                                    </span>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className='pt-1 sm:pt-12 flex-grow'>
                                <div className='flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4'>
                                    <div>
                                        <p className='text-sm font-semibold uppercase tracking-wide text-[#5fa2fa]'>Profile</p>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="mt-1 w-full max-w-xs rounded-md border border-slate-300 px-3 py-1.5 text-2xl font-bold text-slate-950 focus:border-[#5fa2fa] focus:outline-none focus:ring-1 focus:ring-[#5fa2fa] dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-3xl"
                                                placeholder="Enter full name"
                                            />
                                        ) : (
                                            <h1 className='mt-1 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl'>
                                                {user?.fullName || "CineScope User"}
                                            </h1>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-center sm:justify-end">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleCancel} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                                                    <X size={16} /> Cancel
                                                </button>
                                                <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-[#5fa2fa] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4a8ce0]">
                                                    <Save size={16} /> Save
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-lg border border-[#5fa2fa] bg-[#5fa2fa]/10 px-4 py-2 text-sm font-medium text-[#5fa2fa] transition hover:bg-[#5fa2fa]/20 dark:text-[#8fc0ff]">
                                                <Edit size={16} /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className='mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
                                    <span className='inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white/75'>
                                        <Mail size={16} />
                                        {user?.email || "No email available"}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${isEmailVerified
                                            ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                                            : 'border-amber-400/40 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                                            }`}
                                    >
                                        {isEmailVerified ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                                        {isEmailVerified ? "Email verified" : "Email not verified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-8 rounded-lg border border-slate-300/80 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-800/40 sm:p-6'>
                        <div className='mb-5 flex items-center gap-3'>
                            <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#5fa2fa]/15 text-[#5fa2fa]'>
                                <Film size={20} />
                            </span>
                            <div>
                                <h2 className='text-xl font-semibold text-slate-950 dark:text-white'>Favorite genres</h2>
                                <p className='text-sm text-slate-600 dark:text-white/55'>
                                    {isEditing ? "Select the genres you enjoy watching." : "Movies and stories matched to your taste."}
                                </p>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className='flex flex-wrap gap-3'>
                                {genres.map((genre) => {
                                    const isSelected = editedGenres.includes(genre.title);
                                    return (
                                        <button
                                            key={genre.title}
                                            onClick={() => toggleGenre(genre.title)}
                                            className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${isSelected
                                                ? 'border-[#5fa2fa] bg-[#5fa2fa] text-white'
                                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <span>{genre.emoji}</span> {genre.title}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                {editedGenres.length > 0 ? (
                                    <div className='flex flex-wrap gap-3'>
                                        {editedGenres.map((genreTitle) => {
                                            const genreObj = genres.find(g => g.title === genreTitle);
                                            return (
                                                <span
                                                    key={genreTitle}
                                                    className='flex items-center gap-1.5 rounded-lg border border-[#5fa2fa]/30 bg-[#5fa2fa]/10 px-4 py-2 text-sm font-semibold text-[#2f7ee5] dark:text-[#8fc0ff]'
                                                >
                                                    {genreObj?.emoji && <span>{genreObj.emoji}</span>} {genreTitle}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className='rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:text-white/55'>
                                        No genres selected yet.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;