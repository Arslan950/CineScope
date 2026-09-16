import { useState } from "react";
import axios from "axios";
import { handleApiError } from "../lib/errorHandler";

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
            handleApiError(error);
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