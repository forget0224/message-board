import React from 'react'

export default function Textarea({ maxLength, value, onChange }) {
  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="flex flex-col items-start w-full ">
      <textarea
        value={value}
        onChange={handleChange}
        className="border p-2 resize-none w-full h-[150px] bg-[#808c8f] border-[#808c8f] text-white"
        placeholder={`最多輸入 ${maxLength} 個字`}
      />
      <div className="w-full flex justify-end">
        <span className="text-sm text-gray-500 ">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
