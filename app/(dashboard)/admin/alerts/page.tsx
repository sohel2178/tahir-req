"use client";

import { useEffect, useState } from "react";
import { AlertAPI } from "@/lib/api"; // make sure this exists
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
type Alert = {
  _id: string;
  title: string;
  message: string;
  device_id: string;
  date: string; // 👈 add this
};

export default function AdminAlerts() {
  const [imei, setImei] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const isValidIMEI = (imei: string) => {
    return /^\d{15}$/.test(imei);
  };

  const fetchAlerts = async () => {
    if (!isValidIMEI(imei)) return;

    try {
      const data = await AlertAPI.fetchLastAlertsByIMEI(imei, 50);
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    if (!imei) return;

    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 10000); // auto refresh like command page

    return () => clearInterval(interval);
  }, [imei]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteAlert = async (id: string) => {
    await AlertAPI.remove(id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Device Alerts</CardTitle>
        </CardHeader>

        <CardContent>
          {/* IMEI Input */}
          <div className="mb-6">
            <Input
              placeholder="Enter Device IMEI"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {/* Fixed Header */}
            <div className="bg-white border-b">
              <div className="grid grid-cols-4 px-4 py-2 font-medium text-sm">
                <div>Title</div>
                <div>Message</div>
                <div>Time</div>
                <div className="text-right">Action</div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="max-h-[700px] overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="grid grid-cols-4 px-4 py-2 border-b text-sm items-center"
                >
                  <div className="font-semibold">{alert.title}</div>

                  <div>{alert.message}</div>

                  <div className="text-muted-foreground">
                    {formatDate(alert.date)}
                  </div>

                  {/* 🔥 Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteAlert(alert._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
