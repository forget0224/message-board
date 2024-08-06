export const fetchNotes = async () => {
  const response = await fetch('/api/notes')
  if (!response.ok) {
    throw new Error('獲取失敗')
  }
  const data = await response.json()
  return data
}

export const addNote = async (note) => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
  if (!response.ok) {
    throw new Error('新增失敗')
  }
  const data = await response.json()
  return data
}

export const deleteNote = async (noteId, userId) => {
  const response = await fetch('/api/notes', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ noteId, userId }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || '刪除失敗')
  }
  return { noteId, userId }
}
