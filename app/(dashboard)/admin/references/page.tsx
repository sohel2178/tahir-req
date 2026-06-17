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
import { Reference } from "@/types/reference";
import { ReferenceAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

import CreateReferenceDialog from "@/components/references/CreateReferenceDialog";
import EditReferenceDialog from "@/components/references/EditReferenceDialog";
import DeleteReferenceDialog from "@/components/references/DeleteReferenceDialog";

export default function ReferencesPage() {
  const { user } = useAuthStore();
  const [refs, setRefs] = useState<Reference[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<Reference | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: refs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    fetchRefs();
  }, []);

  const fetchRefs = async () => {
    try {
      const data = await ReferenceAPI.list();
      setRefs(data);
    } catch (err) {
      console.error("❌ Failed to fetch references", err);
    }
  };

  const handleCreated = (newRef: Reference) => {
    setRefs((prev) => [...prev, newRef]);
  };

  const handleUpdated = (updated: Reference) => {
    setRefs((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleted = (id: string) => {
    setRefs((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex h-screen w-full flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📖 References</h1>
        {(user?.role === "admin" || user?.role === "manager") && (
          <Button onClick={() => setOpen(true)}>+ Create Reference</Button>
        )}
      </div>

      <div
        ref={parentRef}
        className="flex-1 overflow-auto border rounded-lg mb-1"
      >
        <Table className="relative w-full border">
          <TableHeader className="sticky top-0 bg-gray-100 z-10">
            <TableRow className="grid grid-cols-5 items-center align-middle  text-xl font-bold">
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
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
              const ref = refs[virtualRow.index];
              return (
                <TableRow
                  key={ref.id}
                  ref={(node) => {
                    if (node) rowVirtualizer.measureElement(node);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                  className="grid grid-cols-5 items-center"
                >
                  <TableCell>{ref.name}</TableCell>
                  <TableCell>{ref.username}</TableCell>
                  <TableCell>{ref.contact}</TableCell>
                  <TableCell>{ref.address}</TableCell>
                  <TableCell className="w-[15%] text-right space-x-2">
                    {(user?.role === "admin" || ref.createdBy === user?.id) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRef(ref);
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedRef(ref);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <CreateReferenceDialog
        open={open}
        setOpen={setOpen}
        onCreated={handleCreated}
      />
      <EditReferenceDialog
        open={editOpen}
        setOpen={setEditOpen}
        reference={selectedRef}
        onUpdated={handleUpdated}
      />
      <DeleteReferenceDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        reference={selectedRef}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
