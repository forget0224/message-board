import React from 'react'

const Input = ({ maxLength, placeholder, value, onChange }) => {
  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value)
    }
  }
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className={`border p-2 rounded-sm w-full  h-8 sm:h-10 bg-[#808c8f] border-[#808c8f] text-white`}
      placeholder={placeholder}
    />
  )
}

export default Input
