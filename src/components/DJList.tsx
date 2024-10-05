import React, { useState, useEffect } from 'react'
import { PlusCircle, ArrowUpDown, Upload, Link } from 'lucide-react'

interface DJ {
  id: number
  name: string
  date: string
  logo?: string
}

interface DJListProps {
  searchTerm: string
}

const DJList: React.FC<DJListProps> = ({ searchTerm }) => {
  const [djs, setDJs] = useState<DJ[]>([])
  const [newDJ, setNewDJ] = useState({ name: '', date: '', logo: '' })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [logoInputType, setLogoInputType] = useState<'file' | 'url'>('file')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    const storedDJs = localStorage.getItem('djs')
    if (storedDJs) {
      setDJs(JSON.parse(storedDJs))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('djs', JSON.stringify(djs))
  }, [djs])

  const addDJ = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDJ.name && newDJ.date) {
      setDJs([...djs, { ...newDJ, id: Date.now() }])
      setNewDJ({ name: '', date: '', logo: '' })
      setLogoUrl('')
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewDJ({ ...newDJ, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUrl(e.target.value)
    setNewDJ({ ...newDJ, logo: e.target.value })
  }

  const toggleLogoInputType = () => {
    setLogoInputType(logoInputType === 'file' ? 'url' : 'file')
    setNewDJ({ ...newDJ, logo: '' })
    setLogoUrl('')
  }

  const filteredAndSortedDJs = djs
    .filter((dj) => dj.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  const LogoDisplay = ({ src, alt }: { src: string; alt: string }) => (
    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        style={{
          filter: 'drop-shadow(0px 0px 1px rgba(255,255,255,0.5))',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">DJ 记录</h2>
      <form onSubmit={addDJ} className="space-y-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="DJ 名字"
            value={newDJ.name}
            onChange={(e) => setNewDJ({ ...newDJ, name: e.target.value })}
            className="flex-grow p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            type="date"
            value={newDJ.date}
            onChange={(e) => setNewDJ({ ...newDJ, date: e.target.value })}
            className="p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          {logoInputType === 'file' ? (
            <div className="relative flex-grow">
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all cursor-pointer w-full"
              >
                <Upload className="mr-2" size={18} />
                上传 Logo
              </label>
            </div>
          ) : (
            <input
              type="url"
              placeholder="Logo URL"
              value={logoUrl}
              onChange={handleLogoUrlChange}
              className="flex-grow p-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          )}
          <button
            type="button"
            onClick={toggleLogoInputType}
            className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            <Link size={18} />
          </button>
        </div>
        <button type="submit" className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
          <PlusCircle className="mr-2" size={18} />
          添加 DJ
        </button>
      </form>
      {newDJ.logo && (
        <div className="mb-6">
          <p className="text-gray-300 mb-2">Logo 预览：</p>
          <LogoDisplay src={newDJ.logo} alt="Logo 预览" />
        </div>
      )}
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
        {filteredAndSortedDJs.map((dj) => (
          <li key={dj.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center space-x-4 mb-4">
              {dj.logo && (
                <LogoDisplay src={dj.logo} alt={`${dj.name} logo`} />
              )}
              <div>
                <h3 className="text-xl font-semibold text-purple-400">{dj.name}</h3>
                <p className="text-gray-400">{dj.date}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DJList