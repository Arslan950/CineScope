import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import { CheckCircle2, Mail, ShieldAlert, UserRound, Edit2, Save, Camera, X, Trash2 } from 'lucide-react';
import { useAuthStore } from "../store/AuthStore.js";
import { useCloudinaryImageUpload } from "../hooks/useImageURL.js";
import { genres } from "../lib/static-data.js";
import fallBack from "../assets/fallBack.png";

const fallbackAvatar = "https://res.cloudinary.com/dadnb58fk/image/upload/v1783945175/sk4bfdfewzwc57pfodgu.png" || fallBack;

const Profile = () => {
    const navigate = useNavigate();
    const editUserInfo = useAuthStore((state) => state.editUserInfo);
    const deleteUser = useAuthStore((state) => state.deleteUser);
    const user = useAuthStore((state) => state.user);
    const isEmailVerified = Boolean(user?.isEmailVerified);
    const initialGenres = Array.isArray(user?.genres) ? user.genres : [];

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.fullName || "");
    const [editedGenres, setEditedGenres] = useState(initialGenres);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || fallbackAvatar);

    const fileInputRef = useRef(null);
    const { uploadImage, loading, imageUrl } = useCloudinaryImageUpload();

    const handleAvatarClick = () => {
        if (isEditing) fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;

        setAvatarPreview(URL.createObjectURL(file));
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) setAvatarPreview(uploadedUrl);
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
    };

    const handleSave = (e) => {
        e.preventDefault();
        editUserInfo(avatarPreview, editedGenres, editedName);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        const sucess = await deleteUser();

        if (sucess === true) {
            navigate("/login");
        }
    }

    return (
        <section className='min-h-[80vh] w-full flex items-center justify-center px-4 py-12 mt-10'>

            <div className='w-full max-w-3xl bg-white dark:bg-slate-900/60 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden border border-slate-200 dark:border-slate-800 backdrop-blur-sm'>

                <div className='h-32 w-full bg-gradient-to-r from-[#5fa2fa]/80 via-blue-500/60 to-purple-500/40 dark:from-[#5fa2fa]/40 dark:via-blue-600/20 dark:to-slate-900'></div>

                <div className='px-6 sm:px-12 pb-10'>

                    <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-8'>

                        <div className='relative group flex-shrink-0'>
                            {loading && <span className="loading loading-infinity loading-lg text-[#5fa2fa] absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>}

                            <div className={`relative h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-lg ${isEditing ? 'cursor-pointer' : ''}`}>
                                <img
                                    src={avatarPreview}
                                    alt="Profile avatar"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                                    className={`h-full w-full object-cover transition duration-300 ${isEditing ? 'group-hover:scale-105 opacity-80' : ''} ${loading ? 'opacity-30 blur-sm' : 'opacity-100'}`}
                                    onClick={handleAvatarClick}
                                />

                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <Camera className="text-white drop-shadow-md" size={28} />
                                    </div>
                                )}
                            </div>

                            {!isEditing && !user?.avatar && (
                                <span className='absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-[#5fa2fa] text-white shadow-md'>
                                    <UserRound size={18} />
                                </span>
                            )}

                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <X size={16} /> Cancel
                                    </button>
                                    <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-[#5fa2fa] px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500 shadow-md shadow-[#5fa2fa]/20">
                                        <Save size={16} /> Save
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-[#5fa2fa]/50 bg-[#5fa2fa]/10 px-6 py-2 text-sm font-medium text-[#5fa2fa] transition hover:bg-[#5fa2fa]/20 dark:text-[#8fc0ff]">
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="w-full max-w-md rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-lg sm:text-xl font-bold text-slate-900 dark:text-white focus:border-[#5fa2fa] focus:outline-none focus:ring-1 focus:ring-[#5fa2fa] transition-colors"
                                    placeholder="Enter full name"
                                />
                            ) : (
                                <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white'>
                                    {user?.fullName || "CineScope User"}
                                </h1>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <span className='inline-flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                                    <Mail size={16} />
                                    {user?.email || "No email provided"}
                                </span>
                                <span className='text-slate-300 dark:text-slate-700 hidden sm:inline'>•</span>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isEmailVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                                    {isEmailVerified ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                                    {isEmailVerified ? "Verified Account" : "Unverified"}
                                </span>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        <div>
                            <div className='mb-4 flex items-center gap-2'>
                                <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>Favorite Genres</h2>
                            </div>

                            {isEditing ? (
                                <div className='flex flex-wrap gap-2.5'>
                                    {genres.map((genre) => {
                                        const isSelected = editedGenres.includes(genre.title);
                                        return (
                                            <button
                                                key={genre.title}
                                                onClick={() => toggleGenre(genre.title)}
                                                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${isSelected
                                                    ? 'border-[#5fa2fa] bg-[#5fa2fa] text-white shadow-sm shadow-[#5fa2fa]/30'
                                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                            >
                                                {genre.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className='flex flex-wrap gap-2.5'>
                                    {editedGenres.length > 0 ? (
                                        editedGenres.map((genreTitle) => {
                                            const genreObj = genres.find(g => g.title === genreTitle);
                                            return (
                                                <span key={genreTitle} className='flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300'>
                                                    {genreTitle}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <p className='text-sm text-slate-500 dark:text-slate-400 italic'>
                                            No genres selected yet. Click edit to add your favorites.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-10 pt-6 border-t border-red-500/20">
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Once you delete your account, All your favorites will be gone
                            </p>
                            <button
                                disabled={isEditing}
                                className="btn flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-800"
                                onClick={() => document.getElementById('my_modal_5').showModal()}
                            >
                                <Trash2 size={16} /> Delete Account
                            </button>
                            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                                <div className="modal-box bg-white dark:bg-[#111826] border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="text-red-500">Confirm Deletion</span>
                                    </h3>

                                    <p className="py-4 text-slate-600 dark:text-slate-400">
                                        Are you absolutely sure you want to delete your account? This action <strong>cannot be undone</strong>. All your data and favorites will be permanently lost.
                                    </p>

                                    <div className="modal-action flex items-center justify-end gap-3 mt-2">
                                        <form method="dialog">
                                            <button className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                                Cancel
                                            </button>
                                        </form>

                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-900 duration-200 shadow-md shadow-red-600/20 cursor-pointer"
                                        >
                                            <Trash2 size={16} />Delete Account
                                        </button>
                                    </div>
                                </div>
                            </dialog>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;