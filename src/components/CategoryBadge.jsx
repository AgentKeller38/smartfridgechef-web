function CategoryBadge({ category }) {
  const categories = {
    Dairy: { label: 'Milchprodukte', color: 'bg-blue-100 text-blue-700' },
    Fruits: { label: 'Obst', color: 'bg-orange-100 text-orange-700' },
    Vegetables: { label: 'Gemüse', color: 'bg-green-100 text-green-700' },
    Meat: { label: 'Fleisch', color: 'bg-red-100 text-red-700' },
    Beverages: { label: 'Getränke', color: 'bg-cyan-100 text-cyan-700' },
    Snacks: { label: 'Snacks', color: 'bg-purple-100 text-purple-700' }
  }

  const cat = categories[category] || { label: category, color: 'bg-gray-100 text-gray-700' }

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cat.color}`}>
      {cat.label}
    </span>
  )
}

export default CategoryBadge
