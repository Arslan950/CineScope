import React, { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import HeartFavourites from "./HeartFavourites.jsx";
import { StarIcon } from "lucide-react";

const Card = ({ title, poster, rating, type, id, className = "", allowed = true}) => {

  const navigate = useNavigate();

  const formatRating = (rating) => {
    const value = parseFloat(rating);
    return !value || Number.isNaN(value) ? "Not Rated" : rating.replace("/10", "");
  };

  const displayRating = formatRating(rating);

  const handleClick = useCallback(() => {

    if (!id) {
      return
    }

    const params = new URLSearchParams({ id: id });

    if (type === "movie") {
      navigate(`/explore/movie?${params.toString()}`);
    } else if (type === "tv") {
      navigate(`/explore/tv?${params.toString()}`);
    }

  }, [id, type, navigate])

  return (
    <article
      onClick={(e) => {
        e.preventDefault();
        if (allowed) {
          handleClick();
        }
      }}
      className={`group w-40 shrink-0 snap-start sm:w-auto sm:shrink ${allowed ? "cursor-pointer" : ""}`}>
      <div className="relative xl:w-65 xl:h-90 lg:w-58 lg:h-85 md:w-52 md:h-75 w-40  h-60 overflow-hidden rounded-lg border border-slate-300 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl dark:border-slate-800">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
        />
        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 sm:text-[14px] text-xs font-medium uppercase tracking-wide text-slate-200 backdrop-blur inline-flex items-center gap-1">
          <StarIcon size={14} className="fill-amber-300 stroke-amber-300" />
          {displayRating}
        </span>
        <span className={`absolute right-2 top-2 rounded-full dark:bg-black/65 bg-slate-100/75 p-1.5 ${className}`}>
          <HeartFavourites
            id={id}
            title={title}
            poster={poster}
            rating={rating}
            type={type}
          />
        </span>
      </div>
      <h3 className="mt-2 line-clamp-1 sm:text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-[#5fa2fa] dark:text-slate-100 ml-1 ">
        {title}
      </h3>
    </article>
  );
};

export default React.memo(Card);