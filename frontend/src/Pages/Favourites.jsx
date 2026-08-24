import { useState, useMemo } from 'react';
import { useFavouritesStore } from '../store/FavouritesStore';
import Card from '../components/Cards/Card';
import { Copy, HeartIcon, Share, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/axiosInstance';

const Favourites = () => {
  const favouritesList = useFavouritesStore((state) => state.favouritesList);
  const shareUrl = useFavouritesStore((state) => state.shareUrl);
  const addUrl = useFavouritesStore((state) => state.addUrl);
  const removeUrl = useFavouritesStore((state) => state.removeUrl)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const filteredList = useMemo(() => {
    return favouritesList.filter((media) => {
      if (filter === 'Movies') return media.type === 'movie';
      if (filter === 'Tv show') return media.type === 'tv';
      return true;
    });
  }, [favouritesList, filter]);

  if (favouritesList.length === 0) {
    return (
      <section className='min-h-[75vh] flex flex-col items-center justify-center px-4'>
        <div className='flex flex-col items-center gap-y-4 mb-12 text-center'>
          <h1 className='sm:text-4xl text-3xl font-bold text-slate-900 dark:text-white'>
            Your Favorite Movies
          </h1>
          <p className='text-slate-600 dark:text-white/75'>
            All your saved favorite movies in one place.
          </p>
        </div>

        <div className='flex flex-col items-center gap-y-6 max-w-md text-center'>
          <HeartIcon size={64} className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <p className='text-lg text-slate-600 dark:text-white/75'>
            You haven't added any favorites yet. Start exploring movies!
          </p>
        </div>
      </section>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleShare = async () => {
    if (shareUrl && shareUrl !== "") {
      setUrl(shareUrl);
    } else {
      try {
        setIsLoading(true);
        const response = await api.post("/favourites/generate-link");
        const responseData = response.data?.data
        addUrl(responseData?.sharedUrl);
        setUrl(responseData?.sharedUrl);
      } catch (error) {
        if (error.response) {
          const backendMessage = error.response?.data?.message
          toast.error(backendMessage);
        } else if (error.request) {
          const networkMsg = "Network error. Please check your connection.";
          toast.error(networkMsg);
        } else {
          const unexpectedMsg = "An unexpected error occurred.";
          toast.error(unexpectedMsg);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleRevok = async () => {
    try {
      await api.post("/favourites/revoke-link");
      removeUrl();
      setUrl("");
    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message
        toast.error(backendMessage);
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        toast.error(unexpectedMsg);
      }
    }
  }

  return (
    <section className='mt-20 w-full px-4 sm:px-8 lg:px-12 mb-10'>
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className='border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-xl sm:text-4xl font-bold text-slate-900 dark:text-white'>
              Your Favorites
            </h1>
            <p className='text-slate-600 dark:text-white/75 mt-2 font-medium'>
              {favouritesList.length} {favouritesList.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className='flex items-center sm:gap-x-4 gap-x-2'>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white sm:px-4 sm:py-2.5 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer font-medium"
            >
              <option value="All">All</option>
              <option value="Movies">Movies</option>
              <option value="Tv show">TV Shows</option>
            </select>
            <button
              className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white sm:px-4 sm:py-2.5 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors font-medium cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
                handleShare()
              }}
            >
              <Share size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
            <dialog id="my_modal_3" className={`modal ${isModalOpen ? "modal-open" : ""}`}>
              <div className="modal-box bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 sm:p-8">
                <form method="dialog">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    ✕
                  </button>
                </form>

                <div className="mb-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                    Share link
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Anyone with this link will be able to view your favorites.
                  </p>
                </div>

                {isLoading ? (
                  <div className='flex flex-col items-center justify-center py-8 gap-y-3'>
                    <span className="loading loading-dots loading-lg text-blue-600 dark:text-blue-500"></span>
                    <p className='text-lg font-medium text-slate-700 dark:text-slate-300 animate-pulse'>
                      Generating your link...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        value={url}
                        readOnly
                        type="text"
                        className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 py-3 px-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 truncate transition-shadow"
                      />
                      <button
                        onClick={handleCopy}
                        className={`flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-sm min-w-[110px] ${isCopied
                          ? "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                          : "bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900"
                          }`}
                      >
                        {isCopied ? (
                          <>
                            <Check size={18} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleRevok()}
                      disabled={(url === "")}
                      className='bg-red-600 hover:bg-red-400 duration-200 w-full mt-4 py-2 rounded-lg cursor-pointer text-lg font-medium '>
                      Revoke
                    </button>
                  </>

                )}
              </div>
            </dialog>
          </div>
        </div>

        {
          filteredList.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-10 justify-items-center'>
              {filteredList.map((media) => (
                <Card
                  key={media.id}
                  id={media.id}
                  title={media.title}
                  poster={media.poster}
                  rating={media.rating}
                  type={media.type}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              No {filter.toLowerCase()} found in your favorites.
            </div>
          )
        }
      </div >
    </section >
  );
}

export default Favourites;