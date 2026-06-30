import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const preset = import.meta.env.VITE_CLOUD_PRESET;
const cloudName = import.meta.env.VITE_CLOUD_NAME;

export const useCloudinaryImageUpload = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const uploadImage = async (file) => {
        if (!file) return;

        setLoading(true);
        setErrorMessage("");
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );

            const uploadedUrl = response?.data?.secure_url;
            setImageUrl(uploadedUrl);

            return uploadedUrl;

        } catch (error) {
            if (error.response) {
                const cloudinaryErrorMessage = error.response?.data?.error?.message || "Failure";
                setErrorMessage(cloudinaryErrorMessage);
                toast.error(cloudinaryErrorMessage);
            } else if (error.request) {
                const networkMsg = "Network error. Please check your connection.";
                setErrorMessage(networkMsg);
                toast.error(networkMsg);
            } else {
                const unexpectedMsg = "An unexpected error occurred.";
                setErrorMessage(unexpectedMsg);
                toast.error(unexpectedMsg);
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadImage,
        imageUrl,
        errorMessage,
        loading 
    };
};