import React, { useState } from 'react'
import { GoSearch } from 'react-icons/go'
import { GoPlus } from 'react-icons/go'
import { GoX } from 'react-icons/go'
export default function Header({ showAdd, setShowAdd }) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const handleAddClick = () => {
    setShowAdd(!showAdd)
  }
  const handleSearchClick = () => {
    setShowSearch(!showSearch)
  }
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  const handleSearchClear = () => {
    setSearchQuery('')
  }
  return (
    <div className="w-full   bg-gray-300 ">
      <div className="container flex justify-end py-2 gap-2 px-4">
        <button
          onClick={handleSearchClick}
          className="  text-gray-800 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline  z-20"
        >
          <GoSearch />
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className={` border rounded focus:outline-none focus:shadow-outline bg-gray-400 text-gray-800 -ml-10 z-10 pl-6  text-sm transition-all duration-300 ${
            showSearch ? 'px-6 w-1/2 sm:w-1/5 opacity-100' : 'w-0 opacity-0'
          }`}
          placeholder="Search notes..."
        />
        {showSearch && (
          <GoX onClick={handleSearchClear} className={`my-auto	-ml-7 z-20 `} />
        )}

        <button
          onClick={handleAddClick}
          className="text-gray-800  font-bold py-1 rounded focus:outline-none focus:shadow-outline"
        >
          <GoPlus />
        </button>
      </div>
    </div>
  )
}
