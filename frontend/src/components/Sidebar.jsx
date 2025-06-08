import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'

const Sidebar = ({ setActiveRoom, activeRoom }) => {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chatrooms', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setRooms(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return
    try {
    //   await axios.post(
    //     'http://localhost:5000/api/chatrooms',
    //     { name: roomName },
    //     { headers: { Authorization: `Bearer ${user.token}` } }
    //   )
        await axios.post(
          'http://localhost:5000/api/chatrooms',
          { name: roomName, userIds: [] },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
      setRoomName('')
      fetchRooms()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-1/4 bg-gray-100 border-r overflow-y-auto flex flex-col">
      <div className="p-4 font-bold text-xl border-b">Chat Rooms</div>

      <div className="p-4 border-b flex gap-2">
        <input
          type="text"
          placeholder="New room name"
          className="flex-1 border p-2 rounded"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom} className="bg-blue-500 text-white px-3 py-1 rounded">
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setActiveRoom(room)}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              activeRoom?._id === room._id ? 'bg-blue-200' : ''
            }`}
          >
            {room.name || room._id.slice(-5)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
