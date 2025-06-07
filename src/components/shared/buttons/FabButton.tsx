import { FC } from "react";
import { IconType } from "react-icons";

interface Props {
  isActive: boolean;
  action: () => void;
  Icon: IconType;
  iconSize?: number;
  color?: string;
  tootTipText?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export const FabButton: FC<Props> = ({
  isActive,
  action,
  Icon,
  iconSize = 20,
  color = "white",
  tootTipText,
  tooltipPosition = "top",
}) => {
  const getTooltipPosition = () => {
    switch (tooltipPosition) {
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      default:
        return "bottom-full mb-2";
    }
  };

  return (
    <>
      {isActive && (
        <div className="relative inline-block group">
          <div
            onClick={action}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
          >
            <Icon color={color} size={iconSize} />
          </div>

          {/* Tooltip fuera del botón */}
          {tootTipText && (
            <div
              className={`
                absolute ${getTooltipPosition()}
                left-1/2 -translate-x-1/2
                scale-0 group-hover:scale-100
                opacity-0 group-hover:opacity-100
                whitespace-nowrap rounded bg-gray-900 
                px-3 py-1.5 text-xs text-white
                transition-all duration-200
                z-50 pointer-events-none
                shadow-lg
              `}
              role="tooltip"
            >
              {tootTipText} ✨
              {/* Flecha del tooltip */}
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2
                  ${tooltipPosition === "bottom" ? "-top-1" : "-bottom-1"}
                  border-4 
                  ${tooltipPosition === "bottom" 
                    ? "border-t-0 border-gray-900" 
                    : "border-b-0 border-gray-900"}
                  border-x-transparent
                `}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
