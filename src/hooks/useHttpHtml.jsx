import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { BASE_URL } from '../utils/BASE_URL';

const useHttpHtml = () => {
    const [isLoading, setLoading] = useState(false);
    const current_user = Cookies.get('school') ? JSON.parse(Cookies.get('school')) : null;
    let token = current_user?.token;
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (reqConfig, setterFunction, needToast) => {
        setLoading(true);
        const baseUrl = `${BASE_URL}/${reqConfig.url}`;
        const myToast = needToast && toast.loading('Please Wait...');

        try {
            const req = await fetch(baseUrl, {
                method: reqConfig.method || 'GET',
                headers: reqConfig.headers || {'Authorization': `Bearer ${token}` },
                body: reqConfig.body ? JSON.stringify(reqConfig.body) : null,
            });

            if (!req.ok) {
                const errorResp = await req.text(); // Fetch the error response body as text
                setError(errorResp);
                throw new Error(req.statusText || 'Something went wrong!');
            }

            const resp = await req.blob(); // Fetch the successful response body as text

            if (needToast) {
                toast.update(myToast, {
                    render: 'Request successful!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnHover: false,
                    closeOnClick: true,
                });
            }

            setterFunction(resp);
        } catch (error) {
            if (needToast) {
                toast.update(myToast, {
                    render: error.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 1500,
                    closeOnClick: true,
                    pauseOnHover: false,
                });
            }
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        isLoading,
        sendRequest,
        error,
    };
};

export default useHttpHtml;
