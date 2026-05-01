'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg">
        <h1 className="text-white text-2xl mb-4">Sign In to ATLAS LifeOS</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 text-white"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Sign In
        </button>
        <p className="text-sm text-gray-300 mt-4">
          Demo login: <strong>demo@atlas.com</strong> / <strong>password</strong>
        </p>
      </form>
    </div>
  )
}