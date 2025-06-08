import { FabButton } from "../../components/shared/buttons/FabButton";
import { Carousel } from "../../components/shared/carousel/Carousel";
import { useAuthStore } from "../../stores";
import { MdNewspaper } from "react-icons/md";
import { AiFillHdd } from "react-icons/ai";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { useState } from "react";
import { AddNewForm } from "../../components/shared/forms/AddNewForm";
import { useNewsStore } from "../../stores/news/news.store";

export const NewsPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const [showModalAdd, setShowModalAdd] = useState(false);
  const news = useNewsStore((state) => state.news);
  console.debug('NEWS',news);

  return (
    <div>
      {isAdmin && (
        <div className="pt-5">
          <FabButton
            isActive
            tootTipText={"Ver Todas "}
            action={() => {}}
            Icon={AiFillHdd}
            tooltipPosition="right"
            className="ml-2"
          />
          <FabButton
            isActive
            tootTipText={"Administrar noticias"}
            action={() => setShowModalAdd(true)}
            Icon={MdNewspaper}
            tooltipPosition="right"
            className="ml-2"
          />
        </div>
      )}
      <Carousel news={news}/>
      {/* Add New Modal */}
      <ModalGeneric
        isVisible={showModalAdd}
        setIsVisible={setShowModalAdd}
        title={"Agregar Nueva Noticia"}
        children={<AddNewForm />}
      />

    </div>
  );
};
