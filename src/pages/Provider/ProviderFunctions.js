import axios from "axios";

/* --------------------- Provider --------------------- */

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
 * Save provider data
 */
export async function saveProviderData(data, usage) {
  let 
    config = {
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    response = usage === 'Add' ?
      // Add
      await axios.post('/provider', data, config) : 
      // Edit
      await axios.put('/provider', data, config);

  return response.data.data;
}

/**
 * Delete a specific provider
 * @param {Number} index 
 */
export async function deleteProvider(index) {
  let 
    config = {
        baseURL: 'http://localhost:8000/api',
        params: { index },
        timeout: 60_000
    },
    response = await axios.delete(
        `/provider`,
        config
    );

  return response.data;
}

/* --------------------- Models --------------------- */

/**
 * Load the models of OpenAI
 */
export async function getOpenAIModels(apiKey) {
  let 
    config = {
      baseURL: 'https://api.openai.com/v1',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    },
    response = await axios.get('/models', config);

    return response.data.data;
}

/**
 * Load the models of selhosted LLMs
 */
export async function getSelfhostedModels(hostserver_url) {
  let response = await axios.get(`${hostserver_url}/models`);

  return response.data.data;
}

/**
 * Check, if model is loaded
 */
export async function checkModelStatus(provider) {
  let models = await getSelfhostedModels(provider.data.hostserver_url);

  for(let model of models) if(model.id === provider.data.model) return 'Model loaded';

  return 'Model not loaded';
}

/* --------------------- Other --------------------- */

/**
 * Amount of annotated data with specific provider
 * @param {string} instance_name of provider 
 */
export async function countAnnotatedData(instance_name) {
  let 
    config = {
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        instance_name: instance_name ?? ''
      }
    },
    response = await axios.get('/feedback', config);
  
  return response.data.feedback_count;
}

export async function checkSelfhostedServerStatus(hostserver_url) {
  let response = await axios.head(hostserver_url);

  return response.status
}