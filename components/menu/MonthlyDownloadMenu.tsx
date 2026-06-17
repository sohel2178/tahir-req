"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsMenu({
  downloadExcel,
  downloadPdf,
}: {
  downloadExcel: () => void;
  downloadPdf: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="space-y-2">
        <DropdownMenuItem onClick={downloadExcel}>
          Download Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPdf}>Download Pdf</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
