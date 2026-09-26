export const formatItem = (item, type, includeBackdrop = false) => {
    let dataToSend = {
        id: item.id,
        title: item.title || item.name || item.original_name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : `https://placehold.co/300x450/252525/FFFFFF?text=${item.title}`,
        rating: `${item.vote_average.toFixed(1)}/10`,
        type: type
    }

    if (includeBackdrop && item.backdrop_path) {
        dataToSend.backdrop = `https://image.tmdb.org/t/p/w1920${item.backdrop_path}`;
        dataToSend.overview = item.overview;
    }

    return dataToSend;
};