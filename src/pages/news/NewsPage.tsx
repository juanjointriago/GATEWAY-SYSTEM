import { FabButton } from "../../components/shared/buttons/FabButton";
import { Carousel } from "../../components/shared/carousel/Carousel";
import { useAuthStore } from "../../stores";
import { MdNewspaper } from "react-icons/md";

export const NewsPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  return (
    <div>
      {isAdmin && (
        <div className="pt-5">
          {" "}
          <FabButton
            isActive
            tootTipText={"Administrar noticias"}
            action={() => {}}
            Icon={MdNewspaper}
            tooltipPosition="right"
          />
        </div>
      )}
      <Carousel />
    </div>
  );
};
