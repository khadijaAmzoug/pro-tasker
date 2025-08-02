import { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle submit login form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      })

      // Destructure the response (backend returns: _id, name, email, token)
      const { token, _id, name, email: userEmail } = res.data

      // Persist token
      localStorage.setItem('token', token)

      // Persist user object (since res.data.user does not exist)
      localStorage.setItem('user', JSON.stringify({ _id, name, email: userEmail }))

      // (Optional) simple debug log
      console.log('Login success:', { token, _id, name, email: userEmail })

      // Redirect to dashboard (you can change this later to react-router navigation)
      window.location.href = '/dashboard'
    } catch (err) {
      // Show readable error message
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
      console.error('Login error:', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-sky-200 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-sky-600 text-center mb-6">
          Welcome Back ☀️
        </h2>

        {/* Show error if exists */}
        {error && (
          <p className="mb-4 text-center text-red-600 text-sm">{error}</p>
        )}

        {/* Attach onSubmit so the form actually triggers handleSubmit */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sky-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sky-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-sky-600">
          Don't have an account? <span className="underline cursor-pointer">Register</span>
        </p>
      </div>
    </div>
  )
}

export default Login
