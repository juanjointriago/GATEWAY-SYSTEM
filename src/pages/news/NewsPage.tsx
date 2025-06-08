import { FabButton } from "../../components/shared/buttons/FabButton";
import { Carousel } from "../../components/shared/carousel/Carousel";
import { useAuthStore } from "../../stores";
import { MdNewspaper } from "react-icons/md";
import { AiFillHdd } from "react-icons/ai";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { useMemo, useState } from "react";
import { AddNewForm } from "../../components/shared/forms/AddNewForm";
import { useNewsStore } from "../../stores/news/news.store";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { ColumnDef } from "@tanstack/react-table";
import { INew } from "../../interface/new.interface";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import Swal from "sweetalert2";

export const NewsPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalAll, setShowModalAll] = useState(false);
  const news = useNewsStore((state) => state.news);
  const updateNews = useNewsStore((state) => state.updateNews);
  // console.debug("NEWS", news);
  const columns = useMemo<ColumnDef<INew>[]>(
      
      () => {
        
        return [
        {
          accessorFn: (row) => row.createdAt,
          id: "createdAt",
          cell: (info) => {
            const dateValue = info.getValue() as string;
            if (!dateValue) return "Sin fecha";
            const date = new Date(dateValue);
            const formattedDate = date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric", // Año completo
            });
            const formattedTime = date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return `${formattedDate} ${formattedTime}`;
          },
          header: () => <span>Fecha</span>,
          filterFn: "includesString", // Filtrado por texto
          enableColumnFilter: true,
        },
        {
          accessorKey: "title",
          header: () => <span>Título</span>,
          cell: (info) => info.getValue() as string,
          enableColumnFilter: true,
        },
        {
          accessorKey: "description",
          header: () => <span>Descripción</span>,
          cell: (info) => info.getValue() as string,
          enableColumnFilter: true,
        },
        {
          accessorKey: "imageUrl",
          header: () => <span>Imagen</span>,
          cell: (info) => {
            const imageUrl = info.getValue() as string;
            return (
              <img
                src={imageUrl}
                alt="Imagen de la noticia"
                className="w-20 h-20 object-cover"
              />
            );
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "isActive",
          header: () => <span>Acciones</span>,
          cell: (info) => {
           return (
            <div className="flex flex-direction-row">
              {/* //Cambiar estado */}
              {isAdmin ? (
                <ToggleButton
                  isActive={info.getValue() as boolean}
                  action={() => {
                    Swal.fire({
                      title: "¿Estás seguro?",
                      text: `Estas a punto de ${
                        info.getValue() as boolean ? "ocultar" : "mostrar"
                      } esta noticia`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Sí, continuar",
                      cancelButtonText: "Cancelar",
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        await updateNews({
                          ...info.row.original,
                          isActive: !info.getValue() as boolean,
                        });
                        window.location.reload();
                      }
                    });
                  }}
                />
              ) : (
                <div>{info.getValue() as boolean ? "Público" : "Privado"}</div>
              )}
              {/* //Editar reservación */}
              
              
            </div>
          ) 
          },
          enableColumnFilter: false,
        }
      ]},
      [updateNews, isAdmin]
    );
  return (
    <div>
      {isAdmin && (
        <div className="pt-5">
          <FabButton
            isActive
            tootTipText={"Ver Todas "}
            action={() => setShowModalAll(true)}
            Icon={AiFillHdd}
            tooltipPosition="right"
            className="ml-2"
          />
          <FabButton
            isActive
            tootTipText={"Nuevas notificias"}
            action={() => setShowModalAdd(true)}
            Icon={MdNewspaper}
            tooltipPosition="right"
            className="ml-2"
          />
        </div>
      )}
      <Carousel news={news.filter((n) => n.isActive)} />
      {/* Add New Modal */}
      <ModalGeneric
        isVisible={showModalAdd}
        setIsVisible={setShowModalAdd}
        title={"Agregar Nueva Noticia"}
        children={<AddNewForm />}
      />
      {/* View All News Modal */}

      <ModalGeneric
        isVisible={showModalAll}
        setIsVisible={setShowModalAll}
        title={"Noticias"}
        children={
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Todas las Noticias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news && <TableGeneric data={news} columns={columns}/>}
            </div>
          </div>
        }
      />
    </div>
  );
};
