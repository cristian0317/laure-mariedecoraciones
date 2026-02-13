'use client';

import { useState, useEffect } from 'react';
import ProjectList from '@/app/components/admin/ProjectList';
import ProjectForm from '@/app/components/admin/ProjectForm';

// Raw project from API
interface ApiProject {
  _id: string;
  title: string;
  description: string;
  category: string; // This is a category ID
  images: string[];
}

// Category definition
interface ICategory {
  _id: string;
  name: string;
}

// "Rich" project with populated category
export interface Project {
  _id: string;
  title: string;
  description: string;
  category: ICategory; // This is a category object
  images: string[];
}

export default function DashboardPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/categories')
      ]);

      if (!projectsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const projectsData: ApiProject[] = await projectsRes.json();
      const categoriesData: ICategory[] = await categoriesRes.json();

      const categoryMap = new Map<string, ICategory>();
      categoriesData.forEach(cat => categoryMap.set(cat._id, cat));
      
      const richProjects: Project[] = projectsData.map(p => ({
        ...p,
        category: categoryMap.get(p.category) || { _id: p.category, name: 'Uncategorized' }
      }));

      setProjects(richProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setView('edit');
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        await fetchData(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  const handleCreateNew = () => {
    setCurrentProject(null);
    setView('create');
  };

  const handleFormSuccess = () => {
    fetchData();
    setView('list');
  };

  const renderContent = () => {
    if (loading && view === 'list') {
      return <p>Loading projects...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    switch (view) {
      case 'list':
        return <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'create':
      case 'edit':
        return <ProjectForm project={currentProject} onSuccess={handleFormSuccess} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
            {view === 'list' ? 'Projects' : (view === 'create' ? 'Create New Project' : 'Edit Project')}
        </h1>
        {view === 'list' && (
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
          >
            + Create New
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
}
