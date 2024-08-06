import React, { useState, useEffect } from 'react'
import Typearea from '@/components/typearea'
import Pagination from '@/components/pagination'
import Boards from '@/components/boards'
import Header from '@/components/header'
import Modal from '@/components/modal'
import FormButton from '@/components/formButton'
import { v4 as uuidv4 } from 'uuid'
import {
  fetchNotes,
  addNote,
  deleteNote,
  updateNote,
} from '@/services/notesService'
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
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [currentNote, setCurrentNote] = useState(null)
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
    if (!hasUsername) {
      setUsername('')
    }
    setTo('')
    setMessage('')
  }

  const handleToggleOptions = (noteId) => {
    setActiveNoteId(noteId === activeNoteId ? null : noteId)
  }
  const handleEdit = (noteId) => {
    const note = notesData.find((note) => note.id === noteId)
    setCurrentNote(note)
    setUsername(username)
    setTo(note.to)
    setMessage(note.content)
    setModalContent('edit')
    setIsModalOpen(true)
  }

  const handleReply = (noteId) => {
    const note = notesData.find((note) => note.id === noteId)
    setCurrentNote(note)
    setUsername(username)
    setTo(note.to || '')
    setMessage('')
    setModalContent('reply')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
    setCurrentNote(null)
    setTo('')
    setMessage('')
  }

  const handleSubmitEdit = async () => {
    try {
      const updatedNote = { ...currentNote, to, content: message }
      console.log(updatedNote)
      await updateNote(currentNote.id, updatedNote)
      setNotesData(
        notesData.map((note) =>
          note.id === updatedNote.id ? updatedNote : note,
        ),
      )
      handleCloseModal()
    } catch (error) {
      console.error('更新失敗:', error)
    }
  }

  const handleSubmitReply = async () => {
    try {
      const reply = {
        from: username,
        content: message,
        timestamp: new Date().toISOString(),
      }
      const updatedNote = {
        ...currentNote,
        replies: [...currentNote.replies, reply],
      }

      await updateNote(currentNote.id, updatedNote)
      setNotesData(
        notesData.map((note) =>
          note.id === updatedNote.id ? updatedNote : note,
        ),
      )
      handleCloseModal()
    } catch (error) {
      console.error('回覆失敗', error)
    }
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.note-options') === null) {
        setActiveNoteId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

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
            activeNoteId={activeNoteId}
            onToggleOptions={handleToggleOptions}
            onEdit={handleEdit}
            onReply={handleReply}
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

            <FormButton onSubmit={handleAddNote} onReset={handleReset} />
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent === 'edit' && (
            <>
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
              <FormButton onSubmit={handleSubmitEdit} onReset={handleReset} />
            </>
          )}
          {modalContent === 'reply' && (
            <>
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
              <FormButton onSubmit={handleSubmitReply} onReset={handleReset} />
            </>
          )}
        </Modal>
      )}
    </>
  )
}
