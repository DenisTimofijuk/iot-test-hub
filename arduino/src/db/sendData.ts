import axios from "axios";
import { getToken } from "./login";

export async function sendData(requestData: any) {
    const token = getToken();
    
    if(!token){
        console.error("Missing token. Can't send data to database.")
        return;
    }

    const requestConfig = {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    };

    const response = await axios.post(
        "http://localhost:3000/api/devices/readings",
        requestData,
        requestConfig
    );

    return response;
}
