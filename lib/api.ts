import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { User } from "@/types/user";
import { DeviceModel } from "@/types/deviceModel";
import { Reference } from "@/types/reference";
import { Device } from "@/types/device";
import {
  DailyReport,
  DailyReportRequest,
  DailySpeedReport,
  DailyTravelReport,
  MonthlyItem,
  MonthlyPaymentRequest,
  MonthlyReportRequest,
  RangeReportRequest,
  RangeTravelResponse,
} from "@/types/report";
import { Payment } from "@/types/payment";
import { Command } from "@/types/command";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically (if exists)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 403) {
      const { logout } = useAuthStore.getState();

      // 🛑 prevent multiple triggers
      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";

        logout();

        if (!isLoginPage) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export const UserAPI = {
  list: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data.map((u: any) => ({
      id: u._id, // 👈 map _id → id
      email: u.email,
      name: u.name,
      role: u.role,
      contact: u.contact,
      organization_name: u.organization_name,
      address: u.address,
      image: u.image,
      token: u.token,
      managerId: u.managerId,
    }));
  },

  adminUsers: async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const res = await api.get("/users/admin", {
    params: {
      page,
      limit,
      search,
    },
  });

  return {
    data: res.data.data.map((u: any) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      contact: u.contact,
      organization_name: u.organization_name,
      address: u.address,
      image: u.image,
      token: u.token,
      managerId: u.managerId,
    })),
    pagination: res.data.pagination,
  };
},

  create: async (data: Partial<User> & { password: string }): Promise<User> => {
    const res = await api.post("/users/create", data);
    const u = res.data.user;
    return { ...u, id: u._id }; // 👈 normalize
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    const u = res.data.user;
    return { ...u, id: u._id }; // 👈 normalize
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  search: async (query: string): Promise<User[]> => {
    const res = await api.get(
      `/users/search?search=${encodeURIComponent(query)}`,
    );
    return res.data.map((u: any) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      contact: u.contact,
      organization_name: u.organization_name,
      address: u.address,
      image: u.image,
      token: u.token,
      managerId: u.managerId,
    }));
  },
};

export const DeviceModelAPI = {
  list: async (): Promise<DeviceModel[]> => {
    const res = await api.get("/device-models");
    return res.data.map((m: any) => ({ ...m, id: m._id }));
  },

  create: async (
    data: Omit<DeviceModel, "id" | "createdBy">,
  ): Promise<DeviceModel> => {
    const res = await api.post("/device-models", data);
    const m = res.data.model;
    return { ...m, id: m._id };
  },

  update: async (
    id: string,
    data: Partial<DeviceModel>,
  ): Promise<DeviceModel> => {
    const res = await api.put(`/device-models/${id}`, data);
    const m = res.data.model;
    return { ...m, id: m._id };
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/device-models/${id}`);
  },
};

export const ReferenceAPI = {
  list: async (): Promise<Reference[]> => {
    const res = await api.get("/references");
    return res.data.map((r: any) => ({ ...r, id: r._id }));
  },

  create: async (
    data: Omit<Reference, "id" | "createdBy">,
  ): Promise<Reference> => {
    const res = await api.post("/references", data);
    const r = res.data.reference;
    return { ...r, id: r._id };
  },

  update: async (id: string, data: Partial<Reference>): Promise<Reference> => {
    const res = await api.put(`/references/${id}`, data);
    const r = res.data.reference;
    return { ...r, id: r._id };
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/references/${id}`);
  },
};

export const DeviceAPI = {
  list: async (): Promise<Device[]> => {
    const res = await api.get("/devices");
    return res.data;
  },

  adminUnAssignDevices: async (): Promise<Device[]> => {
    const res = await api.get("/devices/admin/unassign");
    return res.data;
  },

  adminDevices: async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<any> => {
    const res = await api.get("/devices/admin", {
      params: {
        page,
        limit,
        search,
      },
    });

    return res.data;
  },

  managerDevices: async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<any> => {
    const res = await api.get("/devices/manager", {
      params: {
        page,
        limit,
        search,
      },
    });

    return res.data;
  },
  getCurrentDevice: async (id: string): Promise<Device> => {
    const res = await api.get(`/devices/${id}/current_device`);
    return res.data;
  },

  create: async (data: Omit<Device, "createdBy">): Promise<Device> => {
    const res = await api.post("/devices", data);
    return { ...res.data.device, id: res.data.device.id };
  },

  update: async (id: string, data: Partial<Device>): Promise<Device> => {
    const res = await api.put(`/devices/${id}`, data);
    return { ...res.data.device, id: res.data.device.id };
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/devices/${id}`);
  },

  assign: async (id: string, uid: string): Promise<Device> => {
    const res = await api.put(`/devices/${id}/assign`, { uid });
    return { ...res.data.device, id: res.data.device.id };
  },

  unassign: async (id: string): Promise<Device> => {
    const res = await api.put(`/devices/${id}/unassign`);
    return { ...res.data.device, id: res.data.device.id };
  },
};

export const CommandAPI = {
  saveCommand: async (data: Omit<Command, "_id">): Promise<Command> => {
    const res = await api.post("/commands", data);
    return res.data;
  },

  generateBasicCommands: async (imei: string) => {
    const res = await api.post("/commands/generate-basic-command", {
      device_id: imei,
    });

    return res.data;
  },

  createCommand: async ({
    device_id,
    power,
  }: {
    device_id: string;
    power: string;
  }) => {
    const res = await api.post("/commands/create-single-command", {
      device_id: device_id,
      power: power,
    });

    return res.data;
  },

  fetchCommandsByIMEI: async (imei: string): Promise<Command[]> => {
    const res = await api.get(`/commands/${imei}`);
    return res.data;
  },
};

export const AlertAPI = {
  fetchLastAlertsByIMEI: async (imei: string, limit = 50) => {
    const res = await api.get(`/alerts/admin`, {
      params: { imei, limit },
    });
    return res.data;
  },

  fetchLastAlertsByIMEIForManager: async (imei: string, limit = 50) => {
    const res = await api.get(`/alerts/manager`, {
      params: { imei, limit },
    });
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },
};

export const ReportAPI = {
  daily_report: async (data: DailyReportRequest): Promise<DailyReport> => {
    const res = await api.post("/locations/daily-report", data);
    return res.data;
  },
  daily_travel_report: async (
    data: DailyReportRequest,
  ): Promise<DailyTravelReport> => {
    const res = await api.post("/locations/daily-locations", data);
    return res.data;
  },
  range_travel_report: async (
    data: RangeReportRequest,
  ): Promise<RangeTravelResponse> => {
    const res = await api.post("/locations/range-locations-report", data);
    return res.data;
  },
  daily_speed_report: async (
    data: DailyReportRequest,
  ): Promise<DailySpeedReport> => {
    const res = await api.post("/locations/speed-report", data);
    return res.data;
  },

  monthly_report: async (
    data: MonthlyReportRequest,
  ): Promise<MonthlyItem[]> => {
    const res = await api.post("/locations/monthly", data);
    return res.data;
  },
};

export const PaymentAPI = {
  add_payment: async (data: {
    device_id: string;
    registration_number: string;
    customer_email: string;
    customer_number: string;
    service_charge: number;
    payment_method: string;
    year: number;
    month: number; // 0-11
  }): Promise<Payment> => {
    const res = await api.post("/retail_collections/add_payment", data);
    return res.data;
  },
  get_monthly_payment: async (
    data: MonthlyPaymentRequest,
  ): Promise<Payment[]> => {
    const res = await api.post("/retail_collections", data);
    return res.data;
  },

  update_payment: async (
    id: string,
    data: { payment_status: boolean; payment_method: string },
  ): Promise<Payment> => {
    const res = await api.put(`/retail_collections/${id}`, data);
    return res.data;
  },

  delete_payment: async (id: string): Promise<void> => {
    await api.delete(`/retail_collections/${id}`);
  },
};
