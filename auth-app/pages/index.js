import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">User Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> {session.user?.name || 'Not set'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {session.user?.email || 'Not set'}
                </p>
                {session.user?.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {session.user.phone}
                  </p>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Authentication Status</h2>
              <p className="text-green-600 font-medium">✓ You are successfully authenticated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
