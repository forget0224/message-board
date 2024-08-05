import React, { useState, useEffect } from 'react'
import Typearea from '@/components/typearea'
import Pagination from '@/components/pagination'
import Boards from '@/components/boards'
import Header from '@/components/header'
import FormButton from '@/components/formButton'
export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [username, setUsername] = useState('')
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [notesData, setNotesData] = useState([])
  const totalPages = 10

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch('/api/notes')
      const data = await response.json()
      setNotesData(data)
    }

    fetchNotes()
  }, [])

  const addNote = async () => {
    const newNote = { to, content: message, from: username }
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
    const data = await response.json()
    setNotesData([...notesData, data])
    handleReset()
  }
  const handleReset = () => {
    setUsername('')
    setTo('')
    setMessage('')
  }
  return (
    <>
      <div className="bg-[#A8BEC3] min-h-screen flex flex-col">
        <Header showAdd={showAdd} setShowAdd={setShowAdd} />
        <div
          className={` flex flex-col items-center justify-around  flex-grow`}
        >
          <h1 className="font-bold">Message Board</h1>
          <Boards showAdd={showAdd} notesData={notesData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {showAdd && (
          <div className="flex flex-col items-center justify-center py-4 transition-all duration-300 ">
            <Typearea
              username={username}
              setUsername={setUsername}
              to={to}
              setTo={setTo}
              message={message}
              setMessage={setMessage}
            />

            <FormButton addNote={addNote} handleReset={handleReset} />
          </div>
        )}
      </div>
    </>
  )
}
