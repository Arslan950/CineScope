import ChevronRightIcon from '../icons/ChevronRightIcon';
import Card from '../Cards/Card';

const CardSection = ({ movieList, name }) => {
  return (
    <div className='sm:p-7 p-3 space-y-4'>
      <div className='flex items-center gap-1 group'>
        <h3 className='sm:text-4xl text-3xl font-bold sm:mb-3'>{name}</h3>
        <ChevronRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      <div className="flex items-center justify-evenly gap-x-4 overflow-x-auto scrollbar-hide sm:p-4 sm:px-0 md:px-2 px-1 rounded-3xl max-[1026px]:bg-none min-[1026px]:bg-neutral-500/15">
        {
          movieList.map((movie) => (
            <Card
              visiblity={0}
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              rating={movie.rating}
            />
          ))
        }
      </div>
    </div>
  );
}

export default CardSection;