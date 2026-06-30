import React from 'react';
import { CheckCircle2, Film, Mail, ShieldAlert, UserRound } from 'lucide-react';
import { useAuthStore } from "../store/AuthStore.js";

const fallbackAvatar = "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg";

const Profile = () => {
    const user = useAuthStore((state) => state.user);

    const genres = Array.isArray(user?.genres) ? user.genres : [];
    const isEmailVerified = Boolean(user?.isEmailVerified);

    return (
        <section className='flex w-full flex-grow items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
            <div className='w-full max-w-5xl overflow-hidden rounded-lg border border-slate-300/70 bg-white/80 shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900/40 dark:shadow-black/20'>
                <div className='h-28 bg-gradient-to-r from-[#5fa2fa]/35 via-cyan-400/15 to-slate-500/10 dark:from-[#5fa2fa]/25 dark:via-cyan-400/10 dark:to-slate-900'></div>

                <div className='px-5 pb-8 sm:px-8 lg:px-10'>
                    <div className='-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                        <div className='flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left'>
                            <div className='relative'>
                                <img
                                    src={user?.avatar || fallbackAvatar}
                                    alt={user?.fullName ? `${user.fullName} avatar` : "Profile avatar"}
                                    onError={(e) => {
                                        e.currentTarget.src = fallbackAvatar;
                                    }}
                                    className='h-32 w-32 rounded-full border-4 border-white bg-slate-200 object-cover shadow-lg shadow-slate-950/20 dark:border-slate-900 dark:bg-slate-800 sm:h-36 sm:w-36'
                                />
                                <span className='absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#5fa2fa] text-white shadow-md dark:border-slate-900'>
                                    <UserRound size={18} />
                                </span>
                            </div>

                            <div className='pt-1 sm:pt-12'>
                                <p className='text-sm font-semibold uppercase tracking-wide text-[#5fa2fa]'>Profile</p>
                                <h1 className='mt-1 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl'>
                                    {user?.fullName || "CineScope User"}
                                </h1>
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
                                    Movies and stories matched to your taste.
                                </p>
                            </div>
                        </div>

                        {genres.length > 0 ? (
                            <div className='flex flex-wrap gap-3'>
                                {genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className='rounded-lg border border-[#5fa2fa]/30 bg-[#5fa2fa]/10 px-4 py-2 text-sm font-semibold text-[#2f7ee5] dark:text-[#8fc0ff]'
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className='rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:text-white/55'>
                                No genres selected yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;