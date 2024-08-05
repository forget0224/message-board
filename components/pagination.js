import React from 'react'
import { GoMoveToStart } from 'react-icons/go'
import { GoMoveToEnd } from 'react-icons/go'
import { GoArrowLeft } from 'react-icons/go'
import { GoArrowRight } from 'react-icons/go'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []
  const maxPagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = startPage + maxPagesToShow - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const buttonClass =
    'mx-1 lg:px-3   border rounded-md bg-gray-200  disabled:opacity-50'
  const activeButtonClass = 'bg-yellow-200 '

  return (
    <div className="flex justify-center my-1 w-full lg:mt-4 h-full px-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${buttonClass} w-10 sm:h-10  flex items-center justify-center`}
      >
        <GoMoveToStart />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonClass} w-10 sm:h-10 flex items-center justify-center`}
      >
        <GoArrowLeft />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${buttonClass} w-10 sm:h-10  flex items-center justify-center ${page === currentPage ? activeButtonClass : ''}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} w-10 sm:h-10 flex items-center justify-center`}
      >
        <GoArrowRight />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} w-10 sm:h-10 flex items-center justify-center`}
      >
        <GoMoveToEnd />
      </button>
    </div>
  )
}
