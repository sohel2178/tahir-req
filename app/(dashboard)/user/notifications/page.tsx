import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="px-3 pt-3 space-y-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-3 flex justify-between">
          <div>
            <p className="font-semibold">DM-TA-16-6944</p>
            <p className="text-sm text-gray-600">Your Vehicle ACC is OFF!!</p>
            <p className="text-xs text-gray-400">24-Dec-2025 04:46 PM</p>
          </div>
          <Trash2 className="text-red-500 mt-1" />
        </Card>
      ))}
    </div>
  );
}
