import { useState, useEffect, useCallback } from "react";

export const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/new%2F403067512_849396973852142_1211302648810145613_n.jpeg?alt=media&token=0bafc25c-6dda-4d72-b6de-25cff5afa04e",
      alt: "Imagen 1",
      title: "Clases de Inglés",
      description: "Aprende inglés con los mejores profesores nativos y certificados.",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/new%2F406920894_858621392929700_1779249857696630848_n.jpeg?alt=media&token=2f7e079c-40a5-4177-9008-3f151a6ed455",
      alt: "Imagen 2",
      title: "Metodología Única",
      description: "Utilizamos métodos innovadores para un aprendizaje efectivo y rápido.",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/new%2F416932228_879121454213027_2249138083828989363_n.jpeg?alt=media&token=da37cb05-c75f-481a-9620-424afc0c8a81",
      alt: "Imagen 3",
      title: "Ambiente Internacional",
      description: "Únete a una comunidad diversa y practica inglés en situaciones reales.",
    },
  ];

  // Auto-avance del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8 py-4 md:py-6 lg:py-8">
        {/* Carrusel */}
        <div className="relative w-full">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`duration-700 ease-in-out absolute w-full h-full transition-all transform ${
                  index === activeIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <img
                  src={slide.src}
                  className="absolute block w-full h-full object-cover"
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Overlay con texto */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
                  <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base lg:text-lg">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de navegación */}
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-transparent hover:bg-transparent"
            onClick={goToPrev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-gray-200/30 group-hover:bg-white/50 dark:group-hover:bg-gray-200/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-200/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-transparent hover:bg-transparent"
            onClick={goToNext}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-gray-200/30 group-hover:bg-white/50 dark:group-hover:bg-gray-200/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-200/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>

          {/* Indicadores mejorados */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Sección de tarjetas debajo del carrusel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {slide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {slide.description}
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
                  Saber más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
