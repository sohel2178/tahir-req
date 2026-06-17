"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DeviceModel } from "@/types/deviceModel";
import { DeviceModelAPI } from "@/lib/api";

import CreateDeviceModelDialog from "@/components/device-models/CreateDeviceModelDialog";
import EditDeviceModelDialog from "@/components/device-models/EditDeviceModelDialog";
import DeleteDeviceModelDialog from "@/components/device-models/DeleteDeviceModelDialog";

export default function DeviceModelsPage() {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const data = await DeviceModelAPI.list();
      setModels(data);
    } catch (err) {
      console.error("❌ Failed to fetch device models", err);
    }
  };

  const handleCreated = (newModel: DeviceModel) => {
    setModels((prev) => [...prev, newModel]);
  };

  const handleUpdated = (updated: DeviceModel) => {
    setModels((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleted = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📱 Device Models</h1>
        <Button onClick={() => setOpen(true)}>+ Create Device Model</Button>
      </div>

      <div ref={parentRef} className="flex-1 overflow-auto">
        <Table className="relative w-full border">
          <TableHeader className="sticky top-0 bg-gray-100 z-10">
            <TableRow className="grid grid-cols-4 items-center align-middle  text-xl font-bold">
              <TableHead>Name</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Supplier Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const model = models[virtualRow.index];
              return (
                <TableRow
                  key={model.id}
                  ref={(node) => {
                    if (node) rowVirtualizer.measureElement(node);
                  }}
                  data-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-4 items-center"
                >
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.supplier_name}</TableCell>
                  <TableCell>{model.supplier_contact}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedModel(model);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedModel(model);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <CreateDeviceModelDialog
        open={open}
        setOpen={setOpen}
        onCreated={handleCreated}
      />
      <EditDeviceModelDialog
        open={editOpen}
        setOpen={setEditOpen}
        model={selectedModel}
        onUpdated={handleUpdated}
      />
      <DeleteDeviceModelDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        model={selectedModel}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
