import toast from "react-hot-toast";
import { useTheme } from "../ThemeContext";

const useNotification = () => {
    const { isDarkMode } = useTheme();

    const SuccessNotification = (message) => {
        toast.success(message, {
            style: isDarkMode ? { color: '#fff',background: '#333' } : {},
        });
    };

    const ErrorNotification = (message) => {
        toast.error(message, {
            style: isDarkMode ? { color: '#fff',background: '#333' } : {},
        });
    };

    return { SuccessNotification, ErrorNotification };
};

export default useNotification;