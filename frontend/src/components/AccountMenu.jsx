import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { useAccount } from "../hooks/useAccount.js";

const AccountMenu = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const { theme, avatar, userName, onToggleTheme, handleLogout: logout } = useAccount();

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const rowClass =
    'flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa]';

  return (
    <div ref={containerRef} className={`relative  ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu ${userName}`}
        className={`flex h-11 shrink-0 items-center gap-2 rounded-full border p-1 pr-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-[#111826] ${open
          ? 'border-slate-300 bg-slate-200/80 dark:border-white/15 dark:bg-white/10'
          : 'border-transparent bg-slate-200/70 hover:bg-slate-300/70 hover:dark:bg-white/[0.13] dark:bg-white/[0.07]'
          }`}
      >
        <img
          src={avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full border border-slate-300 object-cover dark:border-white/15"
        />
        <span className="max-w-[130px] truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {userName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${open ? 'rotate-180' : ''
            }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-[calc(100%+10px)] w-[236px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#161f30] dark:shadow-black/50"
          >
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="mb-1.5 block rounded-lg border-b border-slate-200 px-2.5 pb-3 pt-1.5 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa2fa] dark:border-white/10 dark:hover:bg-white/5"
            >
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                {userName}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                View profile
              </span>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={onToggleTheme}
              aria-checked={theme === 'dark'}
              className={`${rowClass} text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5`}
            >
              <span className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
                {theme}
              </span>
              <span
                aria-hidden="true"
                className={`relative h-5 w-9 shrink-0 rounded-full ${theme === 'dark' ? 'bg-[#5fa2fa]/40' : 'bg-slate-300'
                  }`}
              >
                <span
                  className={`absolute top-[3px] h-[14px] w-[14px] rounded-full duration-75 bg-[#5fa2fa] ${theme === 'dark' ? 'left-[19px]' : 'left-[3px]'
                    }`}
                />
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={`${rowClass} mt-1 bg-[#5fa2fa]/10 font-medium text-slate-900 hover:bg-[#5fa2fa]/20 dark:text-white`}
            >
              <span className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4 text-[#5fa2fa]" aria-hidden="true" />
                Logout
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(AccountMenu);