import React, { useState } from 'react'

export default function LoginPage({ onLogin }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		setError('')
		if (!email.trim() || !password.trim()) {
			setError('Please enter email and password')
			return
		}

		// Simulate authentication (replace with real auth later)
		onLogin()
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">Sign in to your account</h1>
				<p className="text-sm text-gray-500 mb-6">Enter your credentials to continue to the To‑Do app.</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="••••••••"
						/>
					</div>

					{error && <p className="text-sm text-red-600">{error}</p>}

					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
						>
							Sign in
						</button>
						<button
							type="button"
							onClick={() => { setEmail('demo@user.com'); setPassword('password'); }}
							className="text-sm text-indigo-600 hover:underline"
						>
							Use demo
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
