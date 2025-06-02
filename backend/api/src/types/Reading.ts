export type Dht22Serial = {
    temperature: number;
    humidity: number;
    status: string;
};

export type Ccs811Serial = {
    co2: number;
    tvoc: number;
    status: string;
};

export type SystemSerial = {
    free_heap: number;
    wifi_connected: boolean;
    sensors_ok: boolean;
};


export interface Reading {
  _id?: string;
  device_id: string;
  timestamp: number; // Unix ms
  uptime: number;
  dht22: Dht22Serial;
  ccs811: Ccs811Serial;
  system: SystemSerial;
}
