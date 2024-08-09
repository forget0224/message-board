import React, { useState, useEffect } from 'react'
import Typearea from '@/components/typearea'
import Pagination from '@/components/pagination'
import Boards from '@/components/boards'
import Header from '@/components/header'
import Modal from '@/components/modal'
import FormButton from '@/components/formButton'
import { arrayMove } from '@dnd-kit/sortable'
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
  const [mode, setMode] = useState('boards')
  const notesPerPage = 6
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
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

  useEffect(() => {
    setFilteredNotes(notesData)
  }, [notesData])

  const handleAddNote = async () => {
    const newNote = {
      to,
      content: message,
      from: username,
      userId,
      replies: [],
    }
    try {
      const data = await addNote(newNote)
      setNotesData([data, ...notesData])
      setHasUsername(true)
      setTo('')
      setMessage('')
    } catch (error) {
      console.error('新增失敗', error)
    }
  }

  const handleDelete = async (noteId, userId, replyId = null) => {
    try {
      if (replyId) {
        const noteToUpdate = notesData.find((note) => note.noteId === noteId)
        const updatedReplies = noteToUpdate.replies.filter(
          (reply) => reply.id !== replyId,
        )
        const updatedNote = { ...noteToUpdate, replies: updatedReplies }
        await updateNote(noteId, updatedNote)
        setNotesData(
          notesData.map((note) =>
            note.noteId === noteId ? updatedNote : note,
          ),
        )
        if (currentNote.noteId === noteId) {
          setCurrentNote(updatedNote)
        }
      } else {
        await deleteNote(noteId, userId)
        setNotesData(notesData.filter((note) => note.noteId !== noteId))
        if (currentNote.noteId === noteId) {
          handleCloseModal()
        }
      }
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

  const handleEdit = (noteId, replyId = null) => {
    if (replyId) {
      const note = notesData.find((note) => note.noteId === noteId)
      const reply = note.replies.find((reply) => reply.id === replyId)
      setCurrentNote({ ...reply, isReply: true, noteId: noteId })
      setUsername(username)
      setTo(note.to)
      setMessage(reply.content)
    } else {
      const note = notesData.find((note) => note.noteId === noteId)
      if (note) {
        const { replies, ...noteWithoutReplies } = note // 移除 replies 資料
        setCurrentNote({
          ...noteWithoutReplies,
          isReply: false,
          originalReplies: note.replies,
        })
        setUsername(note.from)
        setTo(note.to)
        setMessage(note.content)
      }
    }
    setModalContent('edit')
    setMode('modal')
    setIsModalOpen(true)
  }

  const handleReply = (noteId) => {
    const note = notesData.find((note) => note.noteId === noteId)
    setCurrentNote(note)
    setUsername(username)
    setTo(note.to || '')
    setMessage('')
    setModalContent('reply')
    setMode('modal')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
    setCurrentNote(null)
    setMode('boards')
    setTo('')
    setMessage('')
  }
  const handleSubmitEdit = async () => {
    try {
      let updatedNote

      if (currentNote.isReply) {
        const parentNote = notesData.find(
          (note) => note.noteId === currentNote.noteId,
        )
        const updatedReplies = parentNote.replies.map((reply) =>
          reply.id === currentNote.id ? { ...reply, content: message } : reply,
        )
        updatedNote = { ...parentNote, replies: updatedReplies }
        await updateNote(currentNote.noteId, updatedNote)
        setNotesData(
          notesData.map((note) =>
            note.noteId === updatedNote.noteId ? updatedNote : note,
          ),
        )
      } else {
        updatedNote = {
          ...currentNote,
          to,
          content: message,
          replies: currentNote.originalReplies || [],
        }
        await updateNote(currentNote.noteId, updatedNote)
        setNotesData(
          notesData.map((note) =>
            note.noteId === updatedNote.noteId ? updatedNote : note,
          ),
        )
      }

      setCurrentNote(updatedNote)
      setMessage('')
      setModalContent('reply')
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
        userId,
        noteId: currentNote.noteId,
      }

      const updatedNote = {
        ...currentNote,
        replies: [...currentNote.replies, reply],
      }
      await updateNote(currentNote.noteId, updatedNote)
      setNotesData(
        notesData.map((note) =>
          note.noteId === updatedNote.noteId ? updatedNote : note,
        ),
      )
      setCurrentNote(updatedNote)
      setMessage('')
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
    setCurrentPage(1)
  }
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage,
  )
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = filteredNotes.findIndex(
      (note) => note.noteId === active.id,
    )
    const newIndex = filteredNotes.findIndex((note) => note.noteId === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const newOrderedNotes = arrayMove(filteredNotes, oldIndex, newIndex)

    setFilteredNotes(newOrderedNotes)
    setNotesData(newOrderedNotes) // 直接使用用戶新排序後的結果
  }

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
            paginatedNotes={paginatedNotes}
            userId={userId}
            deleteNote={handleDelete}
            activeNoteId={activeNoteId}
            onToggleOptions={handleToggleOptions}
            onEdit={handleEdit}
            onReply={handleReply}
            searchQuery={searchQuery}
            mode={mode}
            onDragEnd={handleDragEnd}
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
          activeNoteId={activeNoteId}
          userId={userId}
          mode={mode}
          modalContent={modalContent}
          setModalContent={setModalContent}
          deleteNote={handleDelete}
          onEdit={handleEdit}
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
