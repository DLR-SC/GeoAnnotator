import axios from "axios";

/**
 * Load all providers from backend
 */
export async function loadProviders() {
    let 
        config = {
            baseURL: 'http://localhost:8000/api',
            responseType: 'json'
        },
        response = await axios.get('/provider/all', config);

    return response.data;
}