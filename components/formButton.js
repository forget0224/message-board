import React from 'react'

export default function FormButton({ setUsername, setTo, setMessage }) {
  const handleReset = () => {
    setUsername('')
    setTo('')
    setMessage('')
  }
  return (
    <div className="w-[400px] flex justify-around px-4">
      <button
        onClick={handleReset}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline"
      >
        重填
      </button>
      <button className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline">
        送出
      </button>
    </div>
  )
}
