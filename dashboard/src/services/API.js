const callApi = async (method, endpoint, data, token) => {
    const url = `https://project-tracker-737o.onrender.com/${endpoint}`;
  
    const headers = {
      "Content-Type": "application/json",
    };
  
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  
    const options = {
      method: method.toUpperCase(),
      headers: headers,
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }
  
      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  
  const uploadApi = async (method, endpoint, data, token) => {
    const url = `https://project-tracker-737o.onrender.com/${endpoint}`;
  
    const headers = {};
  
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  
    const options = {
      method: method.toUpperCase(),
      headers: headers,
    };
  
    if (data) {
      options.body = data;
    }
  
    try {
      console.log("API Request:", method, url, options);
      const response = await fetch(url, options);
      const responseData = await response.json();
      console.log("API Response:", response.status, responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }
  
      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  
  module.exports = { callApi, uploadApi };
  