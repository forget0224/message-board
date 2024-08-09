import { v4 as uuidv4 } from 'uuid'
let notesData = [
  {
    noteId: 'c7215784-e6e2-49b8-b449-a5585da719a3',
    userId: 'user-6',
    to: 'Anna',
    content: 'Client feedback received',
    from: 'Support',
    timestamp: '2024/08/02 10:50',
    replies: [],
  },
  {
    noteId: '520667f0-e565-4fdd-8e6f-d17665c49d39',
    userId: 'user-5',
    to: 'Jerry',
    content: 'Design mockup ready',
    from: 'Designer',
    timestamp: '2024/08/02 10:40',
    replies: [
      {
        noteId: '6573ff2d-ea60-424e-a470-07976d379d43',
        id: 1,
        userId: 'user-9',
        from: 'Oscar',
        content: 'Great job!',
        timestamp: '2024/08/02 11:30',
      },
    ],
  },
  {
    noteId: 'fda0e4d3-405e-4347-aaca-79450a108bdf',
    userId: 'user-4',
    to: 'Tom',
    content: 'Code review session',
    from: 'Lead',
    timestamp: '2024/08/02 10:30',
    replies: [
      {
        noteId: 'aa59cbd9-42c5-453e-8d72-15831c5cd3d6',
        id: 1,
        userId: 'user-7',
        from: 'Mike',
        content: 'I have some code to review as well.',
        timestamp: '2024/08/02 11:20',
      },
      {
        noteId: 'b15de28b-b9af-486d-89f7-0706863d2b7d',
        id: 2,
        userId: 'user-8',
        from: 'Nina',
        content: 'Looking forward to it.',
        timestamp: '2024/08/02 11:25',
      },
    ],
  },
  {
    noteId: '9354c864-64a7-45ec-bc60-5fc8c8e7a645',
    userId: 'user-3',
    to: 'Jane',
    content: 'Lunch at 12?',
    from: 'Colleague',
    timestamp: '2024/08/02 10:20',
    replies: [],
  },
  {
    noteId: '0047cc23-e8de-421b-97c9-c5857ed60a95',
    userId: 'user-2',
    to: 'John',
    content: 'Project deadline extended',
    from: 'Manager',
    timestamp: '2024/08/02 10:10',
    replies: [
      {
        noteId: '74230d1c-9c99-4180-9174-0c18f4f91dee',
        id: 1,
        userId: 'user-5',
        from: 'Eve',
        content: 'Thank you for the update.',
        timestamp: '2024/08/02 11:10',
      },
    ],
  },
  {
    noteId: 'aeba36f3-b714-4ddc-b6d3-3b122556e452',
    userId: 'user-1',
    to: 'Alice',
    content: 'Meeting at 3 PM',
    from: 'Bob',
    timestamp: '2024/08/02 10:00',
    replies: [
      {
        noteId: '5833a7a5-8fda-4db1-b8ff-b03b2b52763b',
        id: 1,
        userId: 'user-3',
        from: 'Charlie',
        content: 'I will join the meeting too.',
        timestamp: '2024/08/02 11:00',
      },
      {
        noteId: '575aca4c-0e38-462f-a338-6a45f2773d9b',
        id: 2,
        userId: 'user-4',
        from: 'David',
        content: 'Please send me the meeting link.',
        timestamp: '2024/08/02 11:05',
      },
    ],
  },
]
export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const sortedData = notesData
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      res.status(200).json(sortedData)
      break
    }
    case 'POST': {
      const newNote = req.body
      newNote.noteId = uuidv4()
      newNote.timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')
      newNote.replies = []
      notesData.push(newNote)
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
