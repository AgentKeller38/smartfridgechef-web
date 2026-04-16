import CategoryBadge from './CategoryBadge'

function ItemRow({ item, daysUntilExpiry, onDelete }) {
  const getCategoryColor = (category) => {
    const colors = {
      Dairy: 'bg-blue-500',
      Fruits: 'bg-orange-500',
      Vegetables: 'bg-green-500',
      Meat: 'bg-red-500',
      Beverages: 'bg-cyan-500',
      Snacks: 'bg-purple-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Dairy: '🥛',
      Fruits: '🍎',
      Vegetables: '🥬',
      Meat: '🥩',
      Beverages: '🥤',
      Snacks: '🍿'
    }
    return icons[category] || '📦'
  }

  const getExpiryStatus = () => {
    if (daysUntilExpiry < 0) {
      return { icon: '⚠️', text: 'Abgelaufen', color: 'text-red-600', bg: 'bg-red-100' }
    } else if (daysUntilExpiry === 0) {
      return { icon: '⚠️', text: 'Heute', color: 'text-orange-600', bg: 'bg-orange-100' }
    } else if (daysUntilExpiry <= 3) {
      return { icon: '⏰', text: `${daysUntilExpiry} Tage`, color: 'text-orange-600', bg: 'bg-orange-100' }
    } else {
      return { icon: '✅', text: `${daysUntilExpiry} Tage`, color: 'text-green-600', bg: 'bg-green-100' }
    }
  }

  const expiry = getExpiryStatus()

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 ${getCategoryColor(item.category)} rounded-xl flex items-center justify-center text-2xl`}>
          {getCategoryIcon(item.category)}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge category={item.category} />
            {item.quantity > 0 && (
              <span className="text-xs text-gray-500">x{item.quantity}</span>
            )}
          </div>
          {item.notes && (
            <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
          )}
        </div>

        {/* Expiry */}
        <div className={`px-3 py-1 rounded-lg ${expiry.bg} ${expiry.color} text-sm font-medium text-center`}>
          <div className="flex items-center gap-1">
            <span>{expiry.icon}</span>
            <span>{expiry.text}</span>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ItemRow
