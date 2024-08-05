let notesData = [
  {
    id: 1,
    userId: 'user-1',
    to: 'Alice',
    content: 'Meeting at 3 PM',
    from: 'Bob',
    timestamp: '2024/08/02 10:00',
    replies: [],
  },
  {
    id: 2,
    userId: 'user-2',
    to: 'John',
    content: 'Project deadline extended',
    from: 'Manager',
    timestamp: '2024/08/02 10:10',
    replies: [],
  },
  {
    id: 3,
    userId: 'user-3',
    to: 'Jane',
    content: 'Lunch at 12?',
    from: 'Colleague',
    timestamp: '2024/08/02 10:20',
    replies: [],
  },
  {
    id: 4,
    userId: 'user-4',
    to: 'Tom',
    content: 'Code review session',
    from: 'Lead',
    timestamp: '2024/08/02 10:30',
    replies: [],
  },
  {
    id: 5,
    userId: 'user-5',
    to: 'Jerry',
    content: 'Design mockup ready',
    from: 'Designer',
    timestamp: '2024/08/02 10:40',
    replies: [],
  },
  {
    id: 6,
    userId: 'user-6',
    to: 'Anna',
    content: 'Client feedback received',
    from: 'Support',
    timestamp: '2024/08/02 10:50',
    replies: [],
  },
]

export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const sortedData = notesData.slice().reverse()
      res.status(200).json(sortedData)
      break
    }
    case 'POST': {
      const newNote = req.body
      newNote.id = notesData.length + 1
      newNote.timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')
      newNote.replies = []
      notesData.push(newNote)
      console.log('New note added:', newNote)
      res.status(201).json(newNote)
      break
    }
    case 'DELETE': {
      const { id, userId } = req.body
      const noteIndex = notesData.findIndex(
        (note) => note.id === id && note.userId === userId,
      )
      if (noteIndex !== -1) {
        notesData.splice(noteIndex, 1)
        console.log(`Note with ID ${id} deleted`)
        res.status(200).json({ message: `Note with ID ${id} deleted` })
      } else {
        res.status(404).json({ error: 'Note not found or unauthorized' })
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`${method} 沒有該方法`)
  }
}
