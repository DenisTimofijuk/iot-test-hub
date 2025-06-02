import { ESP8266SerialManager } from "./serialManager";

export default class ESP8266Runner {
    serialManager: any;
    constructor(portPath: string) {
        this.serialManager = new ESP8266SerialManager(portPath);
    }
}
