export interface Device {
  _id?: string;
  device_id: string; // unique
  name?: string;
  location?: string;
  created_at?: Date;
}
