import React from 'react'
import { GoX } from 'react-icons/go'
import Note from './note'
export default function modal({
  isOpen,
  onClose,
  children,
  note,
  onToggleOptions,
  activeNoteId,
  userId,
  mode,
  modalContent,
  deleteNote,
  onEdit,
  setModalContent,
}) {
  const flattenNote = (note) => {
    const noteItem = { ...note, isReply: false }
    const replies = (note.replies || []).map((reply, index) => ({
      ...reply,
      isReply: true,
      noteId: note.noteId,
      id: index + 1,
    }))
    return [noteItem, ...replies]
  }

  const notesModal = flattenNote(note)
  console.log(notesModal)
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center  ${isOpen ? '' : 'hidden'}`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl px-4  h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 relative z-50">
          <div className="flex items-start justify-between  p-3 border-b rounded-t dark:border-gray-600">
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
                {notesModal.map((noteItem, index) => (
                  <Note
                    key={index}
                    {...noteItem}
                    showAdd={false}
                    onReply={null}
                    onEdit={onEdit}
                    deleteNote={deleteNote}
                    noteId={noteItem.noteId}
                    id={index}
                    userId={userId}
                    fromId={noteItem.userId}
                    onToggleOptions={onToggleOptions}
                    showOptions={activeNoteId === index}
                    mode={mode}
                    modalContent={modalContent}
                    setModalContent={setModalContent}
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
