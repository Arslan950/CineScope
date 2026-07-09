import { Trending, Bollywood, webseries } from '../MoviesDB/moviesList.js'
import CardSection from '../components/Cards/CardSection.jsx'
import SearchBar from '../components/SearchBar.jsx'
const Explore = () => {
    return (
        <div className='sm:space-y-0 space-y-10'>      
            <CardSection movieList={Trending} name={`Trending`} />
            <CardSection movieList={Bollywood} name={`Bollywood hits`} />
            <CardSection movieList={webseries} name={`Web series hits`} />
        </div>
    )
}

export default Explore
