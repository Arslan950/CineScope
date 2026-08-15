import React from 'react'

const CastCard = ({ picture, name, role }) => {
  return (
    <div className="card dark:bg-zinc-700 bg-slate-50 sm:w-52 w-40 shrink-0 shadow-sm mb-4 border border-slate-100/20">
      <figure className="w-full sm:h-56 h-48">
        <img
          src={picture}
          alt={name}
          className="w-full h-full object-cover"
          loading='lazy'
        />
      </figure>
      <div className="card-body p-3">
        <h2 className="card-title line-clamp-1">{name}</h2>
        <p className={`line-clamp-1 ${role === "Director" ? "text-blue-400 font-semibold" : ""}`}>{role}</p>
      </div>
    </div>
  )
}

export default CastCard
