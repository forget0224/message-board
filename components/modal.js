import React, { useState } from 'react'
import { GoX } from 'react-icons/go'
import Typearea from './typearea'
export default function modal({ isOpen, onClose, children, mode }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 relative z-50">
          <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-gray-900 text-xl lg:text-2xl font-semibold dark:text-white">
              Modal Title
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <GoX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex  flex-col sm:flex-row">
            <div className="flex-1 border-b sm:border-none">sdfsdf</div>

            <div className=" sm:border-l  space-x-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
