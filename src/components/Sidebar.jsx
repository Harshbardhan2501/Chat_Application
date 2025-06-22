// import { useEffect, useState, useContext } from 'react'
// import axios from 'axios'
// import { AuthContext } from '../contexts/AuthContext'

// const Sidebar = ({ setActiveRoom, activeRoom }) => {
//   const [rooms, setRooms] = useState([])
//   const [roomName, setRoomName] = useState('')
//   const { user } = useContext(AuthContext)

//   useEffect(() => {
//     fetchRooms()
//   }, [])

//   const fetchRooms = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/chatrooms', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })
//       setRooms(res.data)
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) return
//     try {
//     //   await axios.post(
//     //     'http://localhost:5000/api/chatrooms',
//     //     { name: roomName },
//     //     { headers: { Authorization: `Bearer ${user.token}` } }
//     //   )
//         await axios.post(
//           'http://localhost:5000/api/chatrooms',
//           { name: roomName, userIds: [] },
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         )
//       setRoomName('')
//       fetchRooms()
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   return (
//     <div className="w-1/4 bg-gray-100 border-r overflow-y-auto flex flex-col">
//       <div className="p-4 font-bold text-xl border-b">Chat Rooms</div>

//       <div className="p-4 border-b flex gap-2">
//         <input
//           type="text"
//           placeholder="New room name"
//           className="flex-1 border p-2 rounded"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <button onClick={handleCreateRoom} className="bg-blue-500 text-white px-3 py-1 rounded">
//           +
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {rooms.map((room) => (
//           <div
//             key={room._id}
//             onClick={() => setActiveRoom(room)}
//             className={`p-4 cursor-pointer hover:bg-gray-200 ${
//               activeRoom?._id === room._id ? 'bg-blue-200' : ''
//             }`}
//           >
//             {room.name || room._id.slice(-5)}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Sidebar


import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'

const Sidebar = ({ setActiveRoom, activeRoom }) => {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
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

  const handleSearch = async () => {
    if (!search.trim()) return
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${search}`, {
        headers: { Authorization: `Bearer ${user.token}`},
      })
      setSearchResults(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStartChat = async (otherUserId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/chatrooms',
        {
          name: '',
          isGroupChat: false,
          userIds: [otherUserId],
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchRooms()
      setActiveRoom(res.data)
      setSearch('')
      setSearchResults([])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-1/4 bg-gray-100 border-r overflow-y-auto flex flex-col">
      <div className="p-4 font-bold text-xl border-b">Chat Rooms</div>

      {/* Create Room */}
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

      {/* Search Users */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="mt-2 bg-gray-700 text-white px-3 py-1 rounded w-full">
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border-b px-4 py-2 bg-white">
          <div className="text-sm font-semibold text-gray-600 mb-2">Users</div>
          {searchResults.map((u) => (
            <div key={u._id} className="flex justify-between items-center py-1">
              <div className="text-gray-800 text-sm">{u.username}</div>
              <button
                onClick={() => handleStartChat(u._id)}
                className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setActiveRoom(room)}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              activeRoom?._id === room._id ? 'bg-blue-200' : ''
            }`}
          >
            {room.name || room.users?.map(u => u.username).filter(n => n !== user.username).join(', ') || room._id.slice(-5)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
