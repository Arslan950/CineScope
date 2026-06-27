import React from 'react';
import { useAuthStore } from "../store/AuthStore.js";

const Profile = () => {
    const user = useAuthStore((state) => state.user);

    // Fallback while the user data is loading
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-slate-300">
                <p>Loading profile...</p>
            </div>
        );
    }

    // Format the date into a readable string (e.g., "June 25, 2026")
    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
            {/* Profile Card Container */}
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8">
                
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                        <img 
                            src={user.avatar} 
                            alt={`${user.fullName}'s Avatar`} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-sm"
                        />
                        {/* Status Indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-slate-800 rounded-full" title="Online"></div>
                    </div>

                    {/* User Info */}
                    <h1 className="text-2xl font-semibold text-white tracking-wide mb-1">
                        {user.fullName}
                    </h1>
                    
                    <div className="flex items-center space-x-3 mb-8">
                        <p className="text-slate-400 text-sm">{user.email}</p>
                        {user.isEmailVerified && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                                Verified
                            </span>
                        )}
                    </div>

                    {/* Account Details Section */}
                    <div className="w-full bg-slate-900/50 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm font-medium">Account ID</span>
                            <span className="text-slate-300 text-sm font-mono">{user._id.slice(-6)}</span>
                        </div>
                        
                        <div className="h-px bg-slate-700/50 w-full"></div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm font-medium">Member Since</span>
                            <span className="text-slate-300 text-sm">{joinedDate}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full mt-8 space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200">
                            Edit Profile
                        </button>
                        <button className="w-full bg-transparent hover:bg-slate-700 text-slate-300 border border-slate-600 font-medium py-2.5 rounded-lg transition-colors duration-200">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;