export interface Command {
  _id: string;
  device_id: string;
  command_type: string;
  power: string;
  center_number?: string;
}
