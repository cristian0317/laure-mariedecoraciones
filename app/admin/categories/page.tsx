'use client';

import { useState, useEffect } from 'react';

interface ICategory {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setFormError('Category name cannot be empty.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }
      setNewCategoryName('');
      await fetchCategories(); // Refresh list
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories?id=${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete category');
        }
        await fetchCategories(); // Refresh list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>

        {/* Create Category Form */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
            <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="w-full">
                    <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                    <input
                        id="category-name"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Bouquets Personalizados"
                        className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={formLoading}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400"
                >
                    {formLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </div>

        {/* Categories List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
            {loading && <p>Loading categories...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-3">
                    {categories.length === 0 ? (
                        <li className="text-gray-500">No categories found.</li>
                    ) : (
                        categories.map(category => (
                            <li key={category._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-800">{category.name}</span>
                                <button 
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                                >
                                    Delete
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    </div>
  );
}
