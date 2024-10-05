import React, { useState, useEffect } from 'react'
import { PlusCircle, ArrowUpDown } from 'lucide-react'

interface Event {
  id: number
  name: string
  venue: string
  date: string
}

interface EventListProps {
  searchTerm: string
}

const EventList: React.FC<EventListProps> = ({ searchTerm }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({ name: '', venue: '', date: '' })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEvent.name && newEvent.venue && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now() }])
      setNewEvent({ name: '', venue: '', date: '' })
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const filteredAndSortedEvents = events
    .filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">活动记录</h2>
      <form onSubmit={addEvent} className="space-y-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="活动名称"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="flex-grow p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            type="text"
            placeholder="活动场地"
            value={newEvent.venue}
            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
            className="flex-grow p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
        <button type="submit" className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
          <PlusCircle className="mr-2" size={18} />
          添加活动
        </button>
      </form>
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleSortOrder}
          className="flex items-center text-gray-300 hover:text-white transition-all"
        >
          <ArrowUpDown className="mr-2" size={18} />
          {sortOrder === 'asc' ? '最早日期优先' : '最近日期优先'}
        </button>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedEvents.map((event) => (
          <li key={event.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">{event.name}</h3>
            <p className="text-gray-300 mb-1">{event.venue}</p>
            <p className="text-gray-400">{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventList