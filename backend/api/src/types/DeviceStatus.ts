import { SystemSerial } from "./Reading";

export interface DeviceStatus {
  _id?: string;
  device_id: string;
  last_seen: number;
  system: SystemSerial;
  dht22_status: string;
  ccs811_status: string;
}
