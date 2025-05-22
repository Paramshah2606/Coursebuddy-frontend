import axios from "axios";
import { createCipheriv, createDecipheriv } from 'crypto';

const key=process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const iv=process.env.NEXT_PUBLIC_ENCRYPTION_IV;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const encrypted_api_key=encrypt(apiKey);

export function encrypt(request_data) {
    if ( ! request_data) return '';
    try {
        const data = typeof request_data === 'object' ? JSON.stringify(request_data) : request_data;
        const cipher = createCipheriv('AES-256-CBC', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Encryption Error:', error);
        return '';
    }
}

export function decrypt(request_data) {
    try {
        if (!request_data) return {};
        const decipher = createDecipheriv('AES-256-CBC', key, iv);
        let decrypted = decipher.update(request_data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
        console.error('Decryption Error:', error);
        return {};
    }
}

function isJson(request_data) {
    try {
        JSON.parse(request_data);
        return true;
    } catch (error) {
        return false;
    }
}

export async function secureFetch(url, method = "GET", data = null) {
  try {
    let token=localStorage.getItem("user-token");
    let encrypted_token=encrypt(token);
    const myHeaders = new Headers();
myHeaders.append("api_key", encrypted_api_key);
myHeaders.append("Accept-Language", "en");
myHeaders.append("user-token",encrypted_token);
    let requestOptions = {
      method,
      headers:myHeaders,
      redirect: "follow",
    };

    if (data) {
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else {
        const encryptedData = encrypt(data);
        myHeaders.append("Content-Type", "text/plain"); 
        requestOptions.body = encryptedData;
      }
    }

    const response = await fetch(url, requestOptions);
    const result = await response.text();
    const decryptedResult = decrypt(result);
    
    console.log("Decrypted result:", decryptedResult);
    return decryptedResult;

  } catch (error) {
    console.error(`Error in secureFetch (${method} ${url})`, error);
    return { error: `Failed to ${method} ${url}` };
  }
}

export async function secureAxios(url, method = "GET", data = null) {
  try {
      let token = localStorage.getItem("user-token");
      let encrypted_token=encrypt(token);
      const headers = {
          "api_key": encrypted_api_key,
          "Accept-Language": "en",
          "user-token": encrypted_token,
      };

      let encryptedData;
      if (data && !(data instanceof FormData)) {
          encryptedData = encrypt(data);
          headers["Content-Type"] = "text/plain";
      }
      console.log(data);
      console.log("encrypted",encryptedData);

      const axiosOptions = {
          method,
          url,
          headers,
          data: data instanceof FormData ? data : encryptedData,
      };

      const response = await axios(axiosOptions);
      let decryptedData='';
      if(response.data){
        decryptedData = decrypt(response.data);
      }
      console.log("Decrypted result:", decryptedData);
      return decryptedData;

  } catch (error) {
      console.log(decrypt(error.response.data));
      let decryptedError='';
      if(error.response && error.response.data){
        decryptedError=decrypt(error.response.data);
      }
      return decryptedError;
  }
}