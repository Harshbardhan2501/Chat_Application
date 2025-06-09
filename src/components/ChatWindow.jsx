// import { useEffect, useState, useContext, useRef } from 'react'
// import { AuthContext } from '../contexts/AuthContext'
// import axios from 'axios'
// import { io } from 'socket.io-client'

// const socket = io('http://localhost:5000')

// const ChatWindow = ({ activeRoom }) => {
//   const { user } = useContext(AuthContext)
//   const [messages, setMessages] = useState([])
//   const [text, setText] = useState('')
//   const bottomRef = useRef(null)

//   useEffect(() => {
//     if (activeRoom) {
//       socket.emit('joinRoom', activeRoom._id, user._id)

//       const fetchMessages = async () => {
//         const res = await axios.get(`http://localhost:5000/api/messages/${activeRoom._id}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         })
//         setMessages(res.data)
//       }

//       fetchMessages()
//     }
//   }, [activeRoom, user.token, user._id])

//   useEffect(() => {
//     const handleReceive = msg => {
//       setMessages(prev => [...prev, msg])
//     }

//     socket.on('receiveMessage', handleReceive)

//     return () => {
//       socket.off('receiveMessage', handleReceive)
//     }
//   }, [])

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const handleSend = async e => {
//     e.preventDefault()
//     if (!text.trim()) return

//     const messageData = {
//       content: text,
//       chatRoomId: activeRoom._id,
//       senderId: user._id,
//     }

//     socket.emit('sendMessage', messageData)
//     setText('')
//   }

//   if (!activeRoom) {
//     return <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat room</div>
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-white">
//       <div className="p-4 border-b font-bold">{activeRoom.name || 'Chat Room'}</div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded max-w-xs ${
//               (msg.sender?._id || msg.senderId) === user._id
//                 ? 'bg-blue-100 self-end ml-auto'
//                 : 'bg-gray-200'
//             }`}
//           >
//             {msg.sender?.username && (
//               <div className="text-xs text-gray-600 mb-1">{msg.sender.username}</div>
//             )}
//             {msg.content}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//       <form onSubmit={handleSend} className="flex border-t p-4">
//         <input
//           value={text}
//           onChange={e => setText(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 border rounded p-2 mr-2"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
//       </form>
//     </div>
//   )
// }

// export default ChatWindow



import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatWindow = ({ activeRoom }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeRoom) {
      socket.emit('joinRoom', activeRoom._id, user._id);

      const fetchMessages = async () => {
        const res = await axios.get(`http://localhost:5000/api/messages/${activeRoom._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(res.data);
      };

      fetchMessages();
    }
  }, [activeRoom, user.token, user._id]);

  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receiveMessage', handleReceive);

    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageData = {
      content: text,
      chatRoomId: activeRoom._id,
      senderId: user._id,
    };

    socket.emit('sendMessage', messageData);
    setText('');
  };

  if (!activeRoom) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat room</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-4 border-b font-bold">{activeRoom.name || 'Chat Room'}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs ${
              (msg.sender?._id || msg.senderId) === user._id ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-200'
            }`}
          >
            {msg.sender?.username && (
              <div className="text-xs text-gray-600 mb-1">{msg.sender.username}</div>
            )}
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex border-t p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2 mr-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;