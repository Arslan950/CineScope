import React, { useMemo, useCallback } from 'react';
import { useFavouritesStore } from '../../store/FavouritesStore';

const HeartFavourites = ({ id, title, poster, rating, type, onClick, children, className = "", SVGClassName = "" }) => {
    const { favouritesList, addFavourites, removeFavourites } = useFavouritesStore();

    const isFavourited = useMemo(() => {
        return favouritesList.some((movie) => (String(movie.id) === String(id) && movie.type === type));
    }, [favouritesList, id , type]);

    const handleClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isFavourited) {
            addFavourites({
                id : id ,
                title: title,
                poster: poster,
                rating: rating,
                type: type
            });
        } else {
            removeFavourites(id, type);
        }
        onClick?.(e);
    }, [isFavourited, addFavourites, removeFavourites, title, poster, rating, onClick, favouritesList , id , type]);

    return (
        <button onClick={handleClick} className={className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={isFavourited ? 1 : 1.4}
                stroke="currentColor"
                className={`size-6 duration-150 ${SVGClassName}`}
                fill={isFavourited ? "#cf1313" : "transparent"}

            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            {children}
        </button>
    );
};

export default HeartFavourites;