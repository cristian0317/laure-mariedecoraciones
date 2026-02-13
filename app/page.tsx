'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
// import Sidebar from './components/Sidebar'; // Removed
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import ImageModal from './components/ImageModal';
import WhatsAppButton from './components/WhatsAppButton';
import CategoryFilter from './components/CategoryFilter'; // NEW IMPORT

// Raw project from API
interface ApiProject {
  _id: string;
  title: string;
  description: string;
  category: string; // This is a category ID
  images: string[];
}

// Category definition (still needed for Project type)
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

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]); // RE-ADDED state
  const [activeCategory, setActiveCategory] = useState('Todos'); // RE-ADDED state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/categories') // Still need to fetch categories for project rich data
        ]);

        if (!projectsRes.ok || !categoriesRes.ok) {
          throw new Error(`Failed to fetch data`);
        }

        const projectsData: ApiProject[] = await projectsRes.json();
        const categoriesData: ICategory[] = await categoriesRes.json();
        
        // Create a lookup map for categories
        const categoryMap = new Map<string, ICategory>();
        categoriesData.forEach(cat => categoryMap.set(cat._id, cat));
        
        // Create "rich" projects with the category object (still needed for ProjectCard)
        const richProjects: Project[] = projectsData.map(p => ({
          ...p,
          category: categoryMap.get(p.category) || { _id: p.category, name: 'Uncategorized' }
        }));

        setProjects(richProjects);
        setCategories(categoriesData); // RE-ENABLED set state

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = activeCategory === "Todos" // RE-ADDED calculation
    ? projects
    : projects.filter(p => p.category && p.category.name === activeCategory);
  
  return (
    <div className="overflow-x-hidden">
      <div className="bg-purple-300">
        <Header />
        <main className="relative z-10 pt-12 pb-16">
          <div className="mx-4 sm:mx-8 md:mx-12 bg-purple-50 rounded-[3rem] shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Removed Sidebar component */}
              <section id="galeria" className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Convertimos tus celebraciones en momentos mágicos
                </h1>
                <CategoryFilter // NEW COMPONENT
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => ( // Use filteredProjects
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onSelect={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Contact />
      <WhatsAppButton />
      
      {/* Unified Project Modal */}
      <ImageModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Home;
