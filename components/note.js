import React from 'react'

export default function Note({ to, from, content, showAdd }) {
  return (
    <div
      className={`${showAdd ? 'w-20 h-20 sm:w-40 sm:h-40 ' : 'w-32 h-32  sm:w-52 sm:h-52'} bg-yellow-200 shadow-lg p-1  flex flex-col justify-between text-xs`}
    >
      <div className="flex justify-between w-full">
        <p className="text-gray-800 font-bold">{to}</p>
      </div>
      <p
        className={`w-full flex-grow  p-1 rounded resize-none border-none focus:outline-none  ${showAdd ? 'truncate' : 'break-words'} `}
      >
        {content}
      </p>
      <div className="flex justify-between w-full">
        <p className="text-gray-800 font-bold text-right ml-auto">{from}</p>
      </div>
    </div>
  )
}
