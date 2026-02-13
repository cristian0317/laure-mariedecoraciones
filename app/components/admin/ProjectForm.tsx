'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// This is the "rich" project object shape
interface ICategory {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: ICategory;
  images: string[];
}

interface ProjectFormProps {
  project: Project | null; // Expects a rich project or null
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // This will hold the category ID string
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: ICategory[] = await response.json();
        setAllCategories(data);
      } catch (err) {
        setError('Could not load categories.');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      // The project prop has a category object; we need its _id for the form state
      setCategory(project.category?._id);
      setExistingImages(project.images);
    } else {
      // Reset form for creating a new project
      setTitle('');
      setDescription('');
      // Default to the first category if available
      setCategory(allCategories.length > 0 ? allCategories[0]._id : '');
      setExistingImages([]);
    }
    // Always reset new images when the project prop changes
    setNewImages([]);
  }, [project, allCategories]);

  useEffect(() => {
    const newImagePreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews([...existingImages, ...newImagePreviews]);

    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingImages, newImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
        setError("Please select a category.");
        return;
    }
    setLoading(true);
    setError(null);

    try {
      let uploadedImageUrls: string[] = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach(file => formData.append('files', file));
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadResponse.ok) throw new Error('Failed to upload images');
        const uploadResult = await uploadResponse.json();
        uploadedImageUrls = uploadResult.map((res: any) => res.secure_url);
      }

      const finalImageUrls = [...existingImages, ...uploadedImageUrls];
      // The API expects the category ID string for POST/PUT
      const projectData = { title, description, category, images: finalImageUrls };
      
      const apiEndpoint = project ? `/api/projects/${project._id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const projectResponse = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        throw new Error(errorData.message || 'Failed to save project');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-center py-2">{error}</p>}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition" />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select 
          id="category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          required 
          disabled={allCategories.length === 0}
          className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition disabled:bg-gray-100"
        >
          {allCategories.length > 0 ? (
            allCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)
          ) : (
            <option value="">Please create a category first</option>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <Image src={preview} alt={`Preview ${index}`} width={150} height={150} className="rounded-md object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => index < existingImages.length ? handleRemoveExistingImage(index) : handleRemoveNewImage(index - existingImages.length)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-75 group-hover:opacity-100 transition-opacity"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400">
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
