import { FabButton } from "../../components/shared/buttons/FabButton";
import { Carousel } from "../../components/shared/carousel/Carousel";
import { useAuthStore } from "../../stores";
import { IoIosAdd } from "react-icons/io";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { useMemo, useState } from "react";
import { AddNewForm } from "../../components/shared/forms/AddNewForm";
import { useNewsStore } from "../../stores/news/news.store";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { ColumnDef } from "@tanstack/react-table";
import { INew } from "../../interface/new.interface";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import CustomModal from "../../components/CustomModal";

export const NewsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"warn" | "info" | "danger" | "success">("info");
  // Nuevo: guardar registro y estado
  const [pendingNews, setPendingNews] = useState<INew | null>(null);
  const [pendingIsActive, setPendingIsActive] = useState<boolean | null>(null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const [showModalAdd, setShowModalAdd] = useState(false);
  const news = useNewsStore((state) => state.news);
  const updateNews = useNewsStore((state) => state.updateNews);
  // console.debug("NEWS", news);
  const columns = useMemo<ColumnDef<INew>[]>(() => {
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
                    setModalTitle("¿Estás seguro?");
                    setModalMessage(
                      `Estás a punto de ${info.getValue() ? "ocultar" : "mostrar"} esta noticia`
                    );
                    setModalType("warn");
                    setPendingNews(info.row.original);
                    setPendingIsActive(info.getValue() as boolean);
                    setModalOpen(true);
                  }}
                />
              ) : (
                <div>
                  {(info.getValue() as boolean) ? "Público" : "Privado"}
                </div>
              )}
              {/* //Editar reservación */}
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ];
  }, [updateNews, isAdmin]);
  return (
    <div>
      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={async () => {
          if (pendingNews !== null && pendingIsActive !== null) {
            await updateNews({
              ...pendingNews,
              isActive: !pendingIsActive,
            });
          }
          setModalOpen(false);
          setPendingNews(null);
          setPendingIsActive(null);
        }}
        onCancel={() => {
          setModalOpen(false);
          setPendingNews(null);
          setPendingIsActive(null);
        }}
      />
      {isAdmin && (
        <div className="pt-5">
          <FabButton
            isActive
            tootTipText={"Nuevas notificias"}
            action={() => setShowModalAdd(true)}
            Icon={IoIosAdd}
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
      {isAdmin && news && <TableGeneric data={news} columns={columns} />}
    </div>
  );
};
