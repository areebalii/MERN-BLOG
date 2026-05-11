import { toast } from "react-toastify";

export const showToast = (message, type) => {   
  const config = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };
    switch (type) {
      case "success":
        toast.success(message, config);
        break;
      case "error":
        toast.error(message, config);
        break;
      case "info":
        toast.info(message, config);
        break;
      case "warning":
        toast.warning(message, config);
        break;
      default:
        toast(message, config);
    }
}