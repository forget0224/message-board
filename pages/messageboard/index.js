import React, { useState, useEffect } from 'react'
import Typearea from '@/components/typearea'
import Pagination from '@/components/pagination'
import Boards from '@/components/boards'
import Header from '@/components/header'
import FormButton from '@/components/formButton'
import { v4 as uuidv4 } from 'uuid'
import { fetchNotes, addNote, deleteNote } from '@/services/notesService'
const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem('userId', userId)
  }
  return userId
}
export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [hasUsername, setHasUsername] = useState(false)
  const [username, setUsername] = useState('')
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [notesData, setNotesData] = useState([])
  const [userId, setUserId] = useState(null)
  const notesPerPage = 6
  const totalPages = Math.ceil(notesData.length / notesPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const initUserId = () => {
      const id = getUserId()
      setUserId(id)
    }

    const loadNotes = async () => {
      try {
        const data = await fetchNotes()
        setNotesData(data)
      } catch (error) {
        console.error('載入notes失敗', error)
      }
    }

    initUserId()
    loadNotes()
  }, [])

  const handleAddNote = async () => {
    const newNote = { to, content: message, from: username, userId }
    try {
      const data = await addNote(newNote)
      console.log(data)
      setNotesData([data, ...notesData])
      setHasUsername(true)
      setTo('')
      setMessage('')
    } catch (error) {
      console.error('新增失敗', error)
    }
  }

  const handleDelete = async (noteId, userId) => {
    try {
      await deleteNote(noteId, userId)
      setNotesData(notesData.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error('刪除失敗', error)
    }
  }

  const handleReset = () => {
    setUsername('')
    setTo('')
    setMessage('')
  }

  const paginatedNotes = notesData.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage,
  )
  return (
    <>
      <div className="bg-[#A8BEC3] min-h-screen flex flex-col">
        <Header showAdd={showAdd} setShowAdd={setShowAdd} />
        <div
          className={` flex flex-col items-center justify-around  flex-grow`}
        >
          <h1 className="font-bold">Message Board</h1>
          <Boards
            showAdd={showAdd}
            notesData={notesData}
            paginatedNotes={paginatedNotes}
            userId={userId}
            deleteNote={handleDelete}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        {showAdd && (
          <div className="flex flex-col items-center justify-center py-4 transition-all duration-300 ">
            <Typearea
              username={username}
              setUsername={setUsername}
              setHasUsername={setHasUsername}
              hasUsername={hasUsername}
              to={to}
              setTo={setTo}
              message={message}
              setMessage={setMessage}
            />

            <FormButton addNote={handleAddNote} handleReset={handleReset} />
          </div>
        )}
      </div>
    </>
  )
}
