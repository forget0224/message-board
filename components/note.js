import React, { useState } from 'react'
import { GoKebabHorizontal, GoTrash, GoReply, GoPencil } from 'react-icons/go'

export default function Note({
  to,
  from,
  fromId,
  content,
  showAdd,
  userId,
  noteId,
  handleDelete,
}) {
  const [showOptions, setShowOptions] = useState(false)

  const handleToggleOptions = () => {
    setShowOptions(!showOptions)
  }
  return (
    <div
      className={`${showAdd ? 'w-20 h-20 sm:w-40 sm:h-40 ' : 'w-32 h-32  sm:w-52 sm:h-52'} bg-yellow-200 shadow-lg p-1 relative  flex flex-col justify-between text-xs`}
    >
      <div className="flex justify-between w-full">
        <p className="text-gray-800 font-bold">{to}</p>
        <GoKebabHorizontal
          className="cursor-pointer"
          onClick={handleToggleOptions}
        />
      </div>
      <p
        className={`w-full flex-grow  p-1 rounded resize-none border-none focus:outline-none  ${showAdd ? 'truncate' : 'break-words'} `}
      >
        {content}
      </p>
      <div className="flex justify-between w-full">
        <p className="text-gray-800 font-bold text-right ml-auto">{from}</p>
      </div>
      {showOptions && (
        <div className="absolute right-0 bg-white shadow-md rounded-md  mt-3 z-10">
          {fromId === userId && (
            <>
              <button
                // onClick={handleEdit}
                className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
              >
                修改 <GoPencil className="ml-2" />
              </button>
              <button
                onClick={() => handleDelete(noteId)}
                className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
              >
                刪除 <GoTrash className="ml-2" />
              </button>
            </>
          )}
          <button
            // onClick={handleReply}
            className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700"
          >
            回覆 <GoReply className="ml-2" />
          </button>
        </div>
      )}
    </div>
  )
}
