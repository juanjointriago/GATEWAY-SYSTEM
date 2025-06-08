import { useState, useEffect, useCallback, FC } from "react";
import { INew } from "../../../interface/new.interface";
import { ModalGeneric } from "../ui/ModalGeneric";
import { NewDetail } from "../../../pages/news/NewDetail";
interface Props {
  news: INew[];
}
export const Carousel: FC<Props> = ({ news }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedNew, setSelectedNew] = useState<INew | null>(null);

  // Auto-avance del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, [news.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  }, [news.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  }, [news.length]);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8 py-4 md:py-6 lg:py-8">
        {/* Carrusel */}
        <div className="relative w-full">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
            {news.length > 0 &&
              news.map((slide, index) => (
                <div
                  key={index}
                  className={`duration-700 ease-in-out absolute w-full h-full transition-all transform ${
                    index === activeIndex
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    className="absolute block w-full h-full object-cover"
                    alt={slide.altText}
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

          {/* Indicadores laterales */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {news.map((_, index) => (
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
          {news.map((slide, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {slide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {slide.description}
                </p>
                <button
                  onClick={() => {setSelectedNew(slide); setShowModalDetail(true);}}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                  Ver más ...
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Detail New Modal */}

      {selectedNew && selectedNew.id && (
        <ModalGeneric
          isVisible={showModalDetail}
          setIsVisible={setShowModalDetail}
          title={""}
          children={<NewDetail uuid={selectedNew.id} />}
        />
      )}
    </section>
  );
};
