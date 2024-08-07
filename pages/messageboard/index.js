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
  const [filteredNotes, setFilteredNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const notesPerPage = 6
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)

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
        // setFilteredNotes(data)
      } catch (error) {
        console.error('載入notes失敗', error)
      }
    }

    initUserId()
    loadNotes()
  }, [])

  useEffect(() => {
    setFilteredNotes(notesData)
  }, [notesData])
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
      setNotesData(notesData.filter((note) => note.noteId !== noteId))
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
    const note = notesData.find((note) => note.noteId === noteId)
    setCurrentNote(note)
    setUsername(username)
    setTo(note.to)
    setMessage(note.content)
    setModalContent('edit')
    setIsModalOpen(true)
  }

  const handleReply = (noteId) => {
    const note = notesData.find((note) => note.noteId === noteId)
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
      await updateNote(currentNote.noteId, updatedNote)
      setNotesData(
        notesData.map((note) =>
          note.noteId === updatedNote.noteId ? updatedNote : note,
        ),
      )
      handleCloseModal()
    } catch (error) {
      console.error('更新失敗:', error)
    }
  }

  const handleSubmitReply = async () => {
    try {
      const existingReplies = currentNote.replies || []
      const maxId =
        existingReplies.length > 0
          ? Math.max(...existingReplies.map((reply) => reply.id))
          : 0
      const newId = maxId + 1

      const reply = {
        from: username,
        content: message,
        timestamp: new Date().toISOString(),
        id: newId,
      }

      const updatedNote = {
        ...currentNote,
        replies: [...currentNote.replies, reply],
      }
      console.log(updatedNote)
      await updateNote(currentNote.noteId, updatedNote)
      setNotesData(
        notesData.map((note) =>
          note.noteId === updatedNote.noteId ? updatedNote : note,
        ),
      )
      handleCloseModal()
      console.log(notesData)
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

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredNotes(notesData)
    } else {
      const lowerCaseQuery = query.toLowerCase()
      const filtered = notesData.filter(
        (note) =>
          note.content.toLowerCase().includes(lowerCaseQuery) ||
          note.to.toLowerCase().includes(lowerCaseQuery) ||
          note.from.toLowerCase().includes(lowerCaseQuery),
      )
      setFilteredNotes(filtered)
    }
    setCurrentPage(1) // 每次搜索時重置為第一頁
  }

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage,
  )
  return (
    <>
      <div className="bg-[#A8BEC3] min-h-screen flex flex-col">
        <Header
          showAdd={showAdd}
          setShowAdd={setShowAdd}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
            searchQuery={searchQuery}
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
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          note={currentNote}
          replies={currentNote.replies}
          onToggleOptions={handleToggleOptions}
        >
          {modalContent === 'edit' && (
            <>
              <div className="lg:px-4 w-full text-center">
                <h1 className="lg:text-2xl">編輯留言</h1>
              </div>
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
              <div className="lg:px-4 w-full text-center">
                <h1 className="lg:text-2xl">回覆留言</h1>
              </div>
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
