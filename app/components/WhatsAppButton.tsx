import Link from 'next/link';

const WhatsAppButton = () => {
  return (
    <Link
      href="https://wa.me/3314385892"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl">
        <i className="fab fa-whatsapp"></i>
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
      </div>
    </Link>
  );
};

export default WhatsAppButton;
