import Image from 'next/image';

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

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { images, title, description, category } = project;
  const validImages = images.filter(Boolean); // Filter out empty strings, null, undefined
  const firstImage = validImages.length > 0 ? validImages[0] : '/img/logo.png';

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onClick from firing if the button is clicked
    onSelect(project);
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer h-full flex flex-col bg-gray-50"
    >
      <div className="relative w-full h-56">
        <Image
          src={firstImage}
          alt={title}
          fill
          sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover"
        />
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-semibold">
            +{validImages.length - 1}
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-sm text-purple-500 font-semibold mb-2">{category?.name}</p>
        <h3 className="text-xl font-bold text-purple-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm flex-grow">{description}</p>
        <div
          onClick={handleSelect}
          className="mt-auto inline-block bg-pink-500 text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-pink-600 transition-colors self-start"
        >
          Ver Detalles
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
