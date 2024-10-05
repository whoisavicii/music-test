import React, { useState } from 'react'
import { Music, Calendar, Search, Menu, X } from 'lucide-react'
import DJList from './DJList'
import EventList from './EventList'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'djs' | 'events'>('djs')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <header className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              音乐活动记录
            </span>
          </h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <button
                  className={`py-2 px-4 rounded-full transition-all ${
                    activeTab === 'djs'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('djs')}
                >
                  <Music className="inline-block mr-2" size={18} />
                  DJ 记录
                </button>
              </li>
              <li>
                <button
                  className={`py-2 px-4 rounded-full transition-all ${
                    activeTab === 'events'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('events')}
                >
                  <Calendar className="inline-block mr-2" size={18} />
                  活动记录
                </button>
              </li>
            </ul>
          </nav>
          <button className="md:hidden text-white" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full">
          <ul className="space-y-6 text-center">
            <li>
              <button
                className={`py-2 px-4 rounded-full transition-all ${
                  activeTab === 'djs'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('djs')
                  toggleMobileMenu()
                }}
              >
                <Music className="inline-block mr-2" size={18} />
                DJ 记录
              </button>
            </li>
            <li>
              <button
                className={`py-2 px-4 rounded-full transition-all ${
                  activeTab === 'events'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('events')
                  toggleMobileMenu()
                }}
              >
                <Calendar className="inline-block mr-2" size={18} />
                活动记录
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {activeTab === 'djs' ? (
          <DJList searchTerm={searchTerm} />
        ) : (
          <EventList searchTerm={searchTerm} />
        )}
      </main>

      <footer className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 音乐活动记录. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard