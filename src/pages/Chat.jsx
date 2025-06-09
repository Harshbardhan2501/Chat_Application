import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { useState } from 'react'

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState(null)

  return (
    <div className="h-screen flex">
      <Sidebar setActiveRoom={setActiveRoom} activeRoom={activeRoom} />
      <ChatWindow activeRoom={activeRoom} />
    </div>
  )
}

export default Chat
