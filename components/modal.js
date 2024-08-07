import React from 'react'
import { GoX } from 'react-icons/go'
import Note from './note'
export default function modal({
  isOpen,
  onClose,
  children,
  note,
  replies,
  onToggleOptions,
}) {
  const notesModal = [
    { ...note, isReply: false },
    ...replies.map((reply) => ({ ...reply, isReply: true })),
  ]
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center  ${isOpen ? '' : 'hidden'}`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl px-4 h-full h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 relative z-50">
          <div className="flex items-start justify-between  p-3 border-b rounded-t dark:border-gray-600">
            {/* <h3 className="text-gray-900 text-xl lg:text-2xl font-semibold dark:text-white">
              Modal Title
            </h3> */}
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm  ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <GoX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex  flex-col sm:flex-row">
            <div className="flex-1 border-b sm:border-none">
              <div className="p-3 flex sm:flex-col flex-row space-x-4 sm:space-x-0 sm:space-y-4 sm:overflow-y-auto overflow-x-scroll sm:overflow-x-hidden  max-h-[50vh] items-center">
                {/* <Note
                  {...note}
                  showAdd={false}
                  onReply={null}
                  onEdit={null}
                  noteId={note.id}
                  onToggleOptions={onToggleOptions}
                  mode="modal"
                />
                {replies.map((reply, index) => (
                  <div key={index} className="flex flex-col">
                    <Note
                      {...reply}
                      showAdd={false}
                      onReply={null}
                      from={note.from}
                      onEdit={null}
                      mode="modal"
                    />
                  </div>
                ))} */}
                {notesModal.map((noteItem, index) => (
                  <Note
                    key={index}
                    {...noteItem}
                    showAdd={false}
                    onReply={null}
                    onEdit={null}
                    noteId={noteItem.index}
                    onToggleOptions={onToggleOptions}
                    mode="modal"
                  />
                ))}
              </div>
            </div>

            <div className=" sm:border-l  space-x-4 flex flex-col justify-around items-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
