import { Trending, Bollywood, webseries } from '../MoviesDB/moviesList.js'
import CardSection from '../components/Cards/CardSection.jsx'
import SearchBar from '../components/SearchBar.jsx'
const Explore = () => {
    return (
        <div className='sm:space-y-0 space-y-10'>      
            <SearchBar className='sm:mt-8 mt-6 'classNameforIcon='sm:top-14 top-12' classNameforButton='sm:top-14 top-12'/>
            <CardSection movieList={Trending} name={`Trending`} />
            <CardSection movieList={Bollywood} name={`Bollywood hits`} />
            <CardSection movieList={webseries} name={`Web series hits`} />
        </div>
    )
}

export default Explore
