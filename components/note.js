import React from 'react'
import { GoKebabHorizontal, GoTrash, GoReply, GoPencil } from 'react-icons/go'

export default function Note({
  to,
  from,
  fromId,
  content,
  showAdd,
  userId,
  noteId,
  deleteNote,
  showOptions,
  onToggleOptions,
  onEdit,
  onReply,
  replies = [],
  searchQuery = '',
  mode,
  modalContent,
  setModalContent,
  id,
}) {
  const highlightText = (content, query) => {
    if (!query) return content

    const parts = content.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const showKebabIcon =
    (mode === 'modal' && fromId === userId) || mode === 'boards'

  return (
    <div className="relative">
      <div
        className={`${showAdd ? 'w-20 h-20 sm:w-40 sm:h-40' : 'w-32 h-32 sm:w-52 sm:h-52'} bg-yellow-200 cursor-pointer shadow-lg p-1 relative flex flex-col justify-between text-xs`}
        onClick={mode === 'boards' ? () => onReply(noteId) : undefined}
        style={{ zIndex: replies.length + 1 }}
      >
        <div className="flex justify-between w-full">
          <p className="text-gray-800 font-bold">{to}</p>
          {showKebabIcon && (
            <GoKebabHorizontal
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                if (mode === 'modal') {
                  onToggleOptions(id)
                } else {
                  onToggleOptions(noteId)
                }
              }}
            />
          )}
        </div>
        <p
          className={`w-full flex-grow p-1 rounded resize-none border-none focus:outline-none ${showAdd ? 'truncate' : 'break-words'}`}
        >
          {highlightText(content, searchQuery)}
        </p>
        <div className="flex justify-between w-full">
          <p className="text-gray-800 font-bold text-right ml-auto">{from}</p>
        </div>

        {showOptions && (
          <div
            className="note-options absolute right-0 bg-white shadow-md rounded-md mt-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {fromId === userId && (
              <>
                {(modalContent === 'reply' || mode === 'boards') && (
                  <button
                    onClick={() => {
                      if (mode === 'modal') {
                        setModalContent('edit')
                        onEdit(noteId, id)
                      } else {
                        onEdit(noteId)
                      }
                    }}
                    className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    修改 <GoPencil className="ml-2" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (mode === 'modal') {
                      deleteNote(noteId, userId, id)
                    } else {
                      deleteNote(noteId, userId)
                    }
                  }}
                  className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  刪除 <GoTrash className="ml-2" />
                </button>
              </>
            )}
            {(modalContent === 'edit' || mode === 'boards') && (
              <button
                onClick={() => {
                  if (mode === 'modal') {
                    setModalContent('reply')
                  } else {
                    onReply(noteId)
                  }
                }}
                className="flex justify-between items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700"
              >
                回覆 <GoReply className="ml-2" />
              </button>
            )}
          </div>
        )}
      </div>

      {mode === 'boards' && replies.length > 0 && (
        <div
          className={`absolute bg-yellow-300 shadow-lg p-1 flex flex-col justify-between text-xs ${showAdd ? 'w-20 h-20 sm:w-40 sm:h-40 top-1 left-1 sm:top-2 sm:left-2' : 'w-32 h-32 sm:w-52 sm:h-52 top-2 left-2 '}`}
          style={{
            zIndex: replies.length,
          }}
        ></div>
      )}
    </div>
  )
}
