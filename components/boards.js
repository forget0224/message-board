import React from 'react'
import Note from './note'

export default function Boards({
  showAdd,
  userId,
  deleteNote,
  paginatedNotes,
  activeNoteId,
  onToggleOptions,
  onEdit,
  onReply,
  searchQuery,
}) {
  return (
    <div
      className={`${showAdd ? 'h-[200px] sm:h-[400px]' : 'h-[500px]'} transition-all duration-500 lg:w-[800px] w-[350px] border-2 border-[#808c8f] `}
    >
      <div
        className={`grid  ${showAdd ? 'grid-cols-3 sm:gap-8 gap-2' : 'grid-cols-2 sm:gap-12 gap-10  '}   sm:grid-cols-2 lg:grid-cols-3  p-4  justify-items-center`}
      >
        {paginatedNotes.map((note, index) => (
          <Note
            key={index}
            to={note.to}
            content={note.content}
            from={note.from}
            fromId={note.userId}
            noteId={note.noteId}
            showAdd={showAdd}
            userId={userId}
            deleteNote={deleteNote}
            showOptions={activeNoteId === note.noteId}
            onToggleOptions={onToggleOptions}
            onEdit={onEdit}
            onReply={onReply}
            replies={note.replies}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  )
}
