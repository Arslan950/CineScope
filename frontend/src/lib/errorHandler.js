import { toast } from 'react-toastify';

export const handleApiError = (error) => {
    let message = "An unexpected error occurred.";

    if (error.response) {
        message = error.response?.data?.message || "Something went wrong";
    } else if (error.request) {
        message = "Network error. Please check your connection.";
    }

    toast.error(message);

    return message;
};