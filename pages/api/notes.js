let notesData = [
  {
    noteId: 1,
    userId: 'user-1',
    to: 'Alice',
    content: 'Meeting at 3 PM',
    from: 'Bob',
    timestamp: '2024/08/02 10:00',
    replies: [
      {
        id: 1,
        from: 'Charlie',
        content: 'I will join the meeting too.',
        timestamp: '2024/08/02 11:00',
      },
      {
        id: 2,
        from: 'David',
        content: 'Please send me the meeting link.',
        timestamp: '2024/08/02 11:05',
      },
    ],
  },
  {
    noteId: 2,
    userId: 'user-2',
    to: 'John',
    content: 'Project deadline extended',
    from: 'Manager',
    timestamp: '2024/08/02 10:10',
    replies: [
      {
        id: 1,
        from: 'Eve',
        content: 'Thank you for the update.',
        timestamp: '2024/08/02 11:10',
      },
    ],
  },
  {
    noteId: 3,
    userId: 'user-3',
    to: 'Jane',
    content: 'Lunch at 12?',
    from: 'Colleague',
    timestamp: '2024/08/02 10:20',
    replies: [],
  },
  {
    noteId: 4,
    userId: 'user-4',
    to: 'Tom',
    content: 'Code review session',
    from: 'Lead',
    timestamp: '2024/08/02 10:30',
    replies: [
      {
        id: 1,
        from: 'Mike',
        content: 'I have some code to review as well.',
        timestamp: '2024/08/02 11:20',
      },
      {
        id: 2,
        from: 'Nina',
        content: 'Looking forward to it.',
        timestamp: '2024/08/02 11:25',
      },
    ],
  },
  {
    noteId: 5,
    userId: 'user-5',
    to: 'Jerry',
    content: 'Design mockup ready',
    from: 'Designer',
    timestamp: '2024/08/02 10:40',
    replies: [
      {
        id: 1,
        from: 'Oscar',
        content: 'Great job!',
        timestamp: '2024/08/02 11:30',
      },
    ],
  },
  {
    noteId: 6,
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
      newNote.noteId = notesData.length + 1
      newNote.timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')
      newNote.replies = []
      notesData.push(newNote)
      console.log('筆記已新增:', newNote)
      res.status(201).json(newNote)
      break
    }
    case 'PUT': {
      const { noteId, userId, to, content, reply } = req.body
      const noteIndex = notesData.findIndex(
        (note) => note.noteId === noteId && note.userId === userId,
      )
      if (noteIndex !== -1) {
        if (reply) {
          reply.id = notesData[noteIndex].replies.length + 1
          notesData[noteIndex].replies.push(reply)
        } else {
          notesData[noteIndex].to = to
          notesData[noteIndex].content = content
        }
        res.status(200).json(notesData[noteIndex])
      } else {
        res.status(404).json({ error: '找不到該筆記或未授權' })
      }
      break
    }
    case 'DELETE': {
      const { noteId, userId } = req.body
      const noteIndex = notesData.findIndex(
        (note) => note.noteId === noteId && note.userId === userId,
      )
      if (noteIndex !== -1) {
        notesData.splice(noteIndex, 1)
        console.log(`Note with ID ${noteId} deleted`)
        res.status(200).json({ message: `筆記ID:${noteId}已刪除` })
      } else {
        res.status(404).json({ error: '找不到該筆記或未授權' })
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`${method} 沒有該方法`)
  }
}
