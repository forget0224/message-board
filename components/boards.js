import React from 'react'
import Note from './note'

export default function Boards({ showAdd }) {
  const notesData = [
    { to: 'Alice', content: 'Meeting at 3 PM', from: 'Bob' },
    { to: 'John', content: 'Project deadline extended', from: 'Manager' },
    { to: 'Jane', content: 'Lunch at 12?', from: 'Colleague' },
    { to: 'Tom', content: 'Code review session', from: 'Lead' },
    { to: 'Jerry', content: 'Design mockup ready', from: 'Designer' },
    { to: 'Anna', content: 'Client feedback received', from: 'Support' },
  ]

  return (
    <div
      className={`${showAdd ? 'h-[200px]' : 'h-[500px]'} transition-all duration-400 lg:w-[800px] w-[350px] border-2 border-[#808c8f] `}
    >
      <div
        className={`grid  ${showAdd ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-10'}   sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4  justify-items-center`}
      >
        {notesData.map((note, index) => (
          <Note
            key={index}
            to={note.to}
            content={note.content}
            from={note.from}
            showAdd={showAdd}
          />
        ))}
      </div>
    </div>
  )
}
