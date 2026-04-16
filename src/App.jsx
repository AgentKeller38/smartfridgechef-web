import { useState, useEffect } from 'react'
import ItemRow from './components/ItemRow'
import ItemForm from './components/ItemForm'
import CategoryBadge from './components/CategoryBadge'

// Mock-Daten
const initialItems = [
  {
    id: 1,
    name: 'Milch',
    category: 'Dairy',
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 2,
    notes: 'Vollmilch 3,5%'
  },
  {
    id: 2,
    name: 'Eier',
    category: 'Dairy',
    expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 12,
    notes: 'Bio-Hühnereier'
  },
  {
    id: 3,
    name: 'Apfel',
    category: 'Fruits',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 6,
    notes: 'Boskoop'
  },
  {
    id: 4,
    name: 'Brokkoli',
    category: 'Vegetables',
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 2,
    notes: 'Frisch gewaschen'
  },
  {
    id: 5,
    name: 'Joghurt',
    category: 'Dairy',
    expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 4,
    notes: 'Griechischer Joghurt'
  }
]

const categories = [
  { name: 'Dairy', label: 'Milchprodukte', color: 'bg-blue-500' },
  { name: 'Fruits', label: 'Obst', color: 'bg-orange-500' },
  { name: 'Vegetables', label: 'Gemüse', color: 'bg-green-500' },
  { name: 'Meat', label: 'Fleisch', color: 'bg-red-500' },
  { name: 'Beverages', label: 'Getränke', color: 'bg-cyan-500' },
  { name: 'Snacks', label: 'Snacks', color: 'bg-purple-500' }
]

function App() {
  const [items, setItems] = useState(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Items nach Ablaufdatum sortieren
  useEffect(() => {
    const sorted = [...items].sort((a, b) => 
      new Date(a.expirationDate) - new Date(b.expirationDate)
    )
    setItems(sorted)
  }, [])

  // Filterte Items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Item hinzufügen
  const addItem = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now(),
      addedDate: new Date().toISOString()
    }
    setItems(prev => [...prev, item])
    setShowForm(false)
  }

  // Item löschen
  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // Days until expiry
  const getDaysUntilExpiry = (expirationDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expirationDate)
    expiry.setHours(0, 0, 0, 0)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🧊</span> SmartFridgeChef
          </h1>
          <p className="text-blue-100 text-sm mt-1">Dein Kühlschrank-Manager</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{items.length}</div>
            <div className="text-xs text-gray-500">Items</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-500">
              {items.filter(i => getDaysUntilExpiry(i.expirationDate) <= 3).length}
            </div>
            <div className="text-xs text-gray-500">Bald abgelaufen</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-500">
              {new Set(items.map(i => i.category)).size}
            </div>
            <div className="text-xs text-gray-500">Kategorien</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Alle</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center gap-2"
          >
            <span>+</span> Neues Item hinzufügen
          </button>
        )}

        {/* Item Form */}
        {showForm && (
          <ItemForm
            categories={categories}
            onSubmit={addItem}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🧊</div>
              <p>Keine Items gefunden</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                daysUntilExpiry={getDaysUntilExpiry(item.expirationDate)}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>SmartFridgeChef Web App</p>
      </footer>
    </div>
  )
}

export default App
