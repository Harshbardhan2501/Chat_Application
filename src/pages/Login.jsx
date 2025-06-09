import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)
      localStorage.setItem('user', JSON.stringify(res.data))
      setUser(res.data)
      navigate('/')
    } catch (err) {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
