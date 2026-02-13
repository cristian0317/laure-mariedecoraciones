'use client';

interface ICategory {
  _id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: ICategory[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, setActiveCategory }) => {
  
  // Adjusted classes for a top filter bar
  const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50";
  const activeClasses = "bg-purple-600 text-white shadow-md";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
      <button
        onClick={() => setActiveCategory("Todos")}
        className={`${baseClasses} ${activeCategory === 'Todos' ? activeClasses : inactiveClasses}`}
      >
        Todos
      </button>
      {categories.map(cat => (
        <button
          key={cat._id}
          onClick={() => setActiveCategory(cat.name)}
          className={`${baseClasses} ${activeCategory === cat.name ? activeClasses : inactiveClasses}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
