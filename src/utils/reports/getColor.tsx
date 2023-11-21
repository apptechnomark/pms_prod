import { toast } from "react-toastify";

export const getColor = (color: any) => {
  if (typeof color === "string" || typeof color === "number") {
    switch (typeof color === "string" ? parseInt(color) : color) {
      case 1: //present
        return "#198754"; //green color
      case 2: //incomplete hours
        return "#FDB663"; //orange color
      case 3: //half day
        return "#FFC107"; //yellow color
      case 4: //overtime
        return "#800080"; //purple color
      case 5: //absent
        return "#dc3545"; //red color
    }
  } else {
    toast.error("Please provide the valid color code!");
  }
};
