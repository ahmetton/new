import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

export default function SignIn() {
  const router = useRouter()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Registration fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        emailOrPhone,
        password,
        rememberMe,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider) => {
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      setError('Social sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!regEmail && !regPhone) {
      setError('Please provide either email or phone number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail || null,
          phone: regPhone || null,
          password: regPassword,
          name: regName || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto sign in after registration
        const result = await signIn('credentials', {
          redirect: false,
          emailOrPhone: regEmail || regPhone,
          password: regPassword,
        })

        if (result?.error) {
          setError('Account created but sign in failed. Please try signing in manually.')
        } else {
          router.push('/')
        }
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Note: We can't check env vars at runtime in client components, so social buttons are always hidden
  // To show social buttons, the OAuth providers must be configured in the NextAuth config
  // and you should manually set these flags based on your configuration
  const hasGoogleAuth = false // Set to true if you've configured Google OAuth
  const hasFacebookAuth = false // Set to true if you've configured Facebook OAuth
  const hasSocialAuth = hasGoogleAuth || hasFacebookAuth

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {showRegister ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showRegister ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!showRegister ? (
          /* Sign In Form */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone Number
                </label>
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/reset-request" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {hasSocialAuth && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {hasGoogleAuth && (
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FaGoogle className="h-5 w-5 text-red-500" />
                      <span className="ml-2">Google</span>
                    </button>
                  )}
                  {hasFacebookAuth && (
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('facebook')}
                      className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FaFacebook className="h-5 w-5 text-blue-600" />
                      <span className="ml-2">Facebook</span>
                    </button>
                  )}
                </div>
              </>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="regName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  id="regName"
                  name="name"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="regEmail"
                  name="email"
                  type="email"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="regPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Alternative to email)
                </label>
                <input
                  id="regPhone"
                  name="phone"
                  type="tel"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your phone number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="regPassword"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="At least 8 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="regConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Re-enter your password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
