import { FC, useEffect, useState } from "react";
import { useNewsStore } from "../../stores/news/news.store";
import { INew } from "../../interface/new.interface";

interface Props {
  uuid: string;
}

export const NewDetail: FC<Props> = ({ uuid }) => {
  const getNewsById = useNewsStore((state) => state.getNewsById);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<INew | undefined>(undefined);

  useEffect(() => {
    const fetchNews = () => {
      try {
        const newsData = getNewsById(uuid);
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [uuid, getNewsById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative w-24 h-24">
          <div className="absolute border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full w-24 h-24 animate-spin"></div>
          <div className="absolute border-4 border-t-transparent border-r-indigo-300 border-b-transparent border-l-transparent rounded-full w-20 h-20 top-2 left-2 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">No se encontró la noticia 😢</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Container para imagen y contenido */}
        <div className="lg:flex lg:min-h-[600px]">
          {/* Contenedor de imagen */}
          <div className="relative h-72 sm:h-96 lg:h-auto lg:flex-1">
            <img
              src={news.imageUrl}
              alt={news.altText || news.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent lg:bg-gradient-to-r"></div>
          </div>

          {/* Contenedor de información */}
          <div className="relative lg:flex-1 lg:flex lg:flex-col lg:justify-between">
            <div className="px-6 py-8 lg:px-12 lg:py-12">
              {/* Badge de fecha */}
              <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm mb-6">
                Publicado el{" "}
                {new Date(news.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {news.title}
              </h1>

              {/* Descripción */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {news.description}
                </p>
              </div>

              {/* Footer con metadatos adicionales */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Última actualización:{" "}
                    {new Date(news.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
