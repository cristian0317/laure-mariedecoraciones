import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 text-white bg-purple-600/80 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/img/logo.png"
            alt="Logo Laure & Marie"
            width={48}
            height={48}
            className="rounded-full shadow-md"
          />
          <span className="text-2xl font-bold tracking-tight hidden sm:block">
            Laure & Marie Decoraciones
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="#galeria"
            className="px-4 py-2 rounded-full font-semibold hover:bg-white/20 transition-colors"
          >
            Galería
          </Link>
          <Link
            href="#contacto"
            className="px-4 py-2 rounded-full font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
