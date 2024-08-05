import React from 'react'
import Input from '@/components/input'
import Textarea from './textarea'
export default function Typearea({
  username,
  setUsername,
  to,
  setTo,
  message,
  setMessage,
}) {
  return (
    <>
      <div className="bg-[#A8BEC3] lg:w-[400px] lg:h-[350px] w-[300px] h-[225px]   lg:p-4">
        <div className="flex flex-col justify-around items-center w-full h-full">
          <div className="flex flex-row justify-between items-center w-full gap-2">
            <Input
              maxLength={20}
              placeholder={`username`}
              value={username}
              onChange={setUsername}
            />
            <Input
              maxLength={20}
              placeholder={`to:`}
              value={to}
              onChange={setTo}
            />
          </div>

          <div className="flex flex-row justify-center items-center w-full">
            <Textarea maxLength={200} value={message} onChange={setMessage} />
          </div>
        </div>
      </div>
    </>
  )
}
