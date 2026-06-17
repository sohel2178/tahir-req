export interface Payment {
  _id: string; // MongoDB ObjectId as string
  device_id: string;
  registration_number: string;
  customer_email: string;
  customer_number: string;
  service_charge: number;
  payment_status: boolean;
  year: number;
  month: number;
}
