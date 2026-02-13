import Link from 'next/link';

const Contact = () => {
  return (
    <section id="contacto" className="py-20 text-center">
      <h2 className="text-3xl font-bold text-purple-800">
        ¿Lista para celebrar?
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        Hablemos de tu idea y la haremos realidad.
      </p>
      <Link
        href="https://wa.me/3314385892"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-8 bg-purple-600 text-white font-bold text-lg px-8 py-3 rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg"
      >
        Contactar por WhatsApp
      </Link>
    </section>
  );
};

export default Contact;
