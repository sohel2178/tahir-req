import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Power } from "lucide-react";

export default function FuelCut({
  fuelLine,
  onConfirm,
}: {
  fuelLine: "ON" | "OFF";
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          <Power
            size={20}
            className={`cursor-pointer ${
              fuelLine === "ON"
                ? "text-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                : "text-red-500 animate-pulse drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            }`}
          />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {fuelLine === "ON" ? "Cut Off Fuel Pump?" : "Restore Fuel Pump?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {fuelLine === "ON"
              ? "Do you want to cut off the fuel pump line? The engine may stop immediately."
              : "Do you want to restore the fuel pump line? The engine will resume normally."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className={
              fuelLine === "ON"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
            onClick={onConfirm}
          >
            {fuelLine === "ON" ? "Cut Off" : "Restore"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
