'use client';

interface ICategory {
  _id: string;
  name: string;
}

interface SidebarProps {
  categories: ICategory[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategory, setActiveCategory }) => {
  
  const baseClasses = "px-4 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-md border border-white/20";
  const activeClasses = "bg-black text-white shadow-lg";
  const inactiveClasses = "bg-white/10 text-white hover:bg-white/20";

  return (
    <aside className="w-full md:w-72 p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-white/5"> {/* Added bg-white/5 for contrast */}
      <h2 className="text-2xl font-bold text-white mb-6">Categorías</h2> {/* Changed text-purple-800 to text-white */}
      <div className="flex flex-wrap gap-3 justify-center">
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
    </aside>
  );
};

export default Sidebar;
