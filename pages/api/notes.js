let notesData = [
  { id: 1, to: 'Alice', content: 'Meeting at 3 PM', from: 'Bob' },
  { id: 2, to: 'John', content: 'Project deadline extended', from: 'Manager' },
  { id: 3, to: 'Jane', content: 'Lunch at 12?', from: 'Colleague' },
  { id: 4, to: 'Tom', content: 'Code review session', from: 'Lead' },
  { id: 5, to: 'Jerry', content: 'Design mockup ready', from: 'Designer' },
  { id: 6, to: 'Anna', content: 'Client feedback received', from: 'Support' },
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
      notesData.push(newNote)
      console.log('New note added:', newNote)
      res.status(201).json(newNote)
      break
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`${method} 沒有該方法`)
  }
}
