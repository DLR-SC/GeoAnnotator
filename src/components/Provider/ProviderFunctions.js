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

/**
 * Delete a specific provider
 * @param {string} instance_name 
 */
export async function deleteProvider(instance_name) {
    let 
        config = {
            baseURL: 'http://localhost:8000/api',
            params: { instance_name },
            timeout: 60_000
        },
        response = await axios.delete(
            `/provider/delete`,
            config
        );

    return response.data;
}