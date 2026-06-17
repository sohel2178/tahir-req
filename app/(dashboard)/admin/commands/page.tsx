"use client";

import { useEffect, useState } from "react";
import { CommandAPI } from "@/lib/api";
import { Command } from "@/types/command";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sampleCommands = [
  "APN#",
  "PARAM#",
  "STATUS#",
  "SERVER#",
  "URL#",
  "CXZT",
  "RELAY,1#",
  "RELAY,0#",
  "VERSION#",
  "WHERE#",
  "SENDS#",
  "SENDS,30#",
  "SENDS,60#",
  "SENDS,0#",
  "SPEED,ON,20,80,0#",
  "SWERVE,ON,0,30,50,3#",
  "SPEEDCHECK,ON,0,4,30,50#",
  "SPEEDCHECK#",
  "SWERVE#",
  "SZCS#SOURCE_OFF_TYPE=1",
  "SZCS#SOURCE_OFF_TYPE=0",
  "SZCS#GT06SEL=1",
  "SZCS#GT06IEXVOL=2",
  "MILEAGE=0#",
  "IPLOCK,123456,020178#",
  "IPLOCK,A,020178,01409962090#",
  "SZCS#MAIN_IPLOCK=1",
  "SZCS#GPS_DISSLP=1",
  "SZCS#GPS_DISSLP=0",
  "EXBATCUT,ON,0,122,124,10#",
  "EXBATCUT,OFF#",
  "EXBATCUT#",
  "EXBATALM,ON,0,122,124,10#",
  "EXBATALM#",
  "PASSWORD,666666,020178#",
  "PWDSW,ON#",
  "ADT#",
];

export default function AdminCommands() {
  const [imei, setImei] = useState("");
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newCommand, setNewCommand] = useState({
    command: "",
  });

  const [filteredCommands, setFilteredCommands] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (value: string) => {
    setNewCommand({ command: value });

    if (!value) {
      setFilteredCommands([]);
      return;
    }

    const filtered = sampleCommands.filter((cmd) =>
      cmd.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredCommands(filtered);
    setShowDropdown(true);
  };

  const handleCreateCommand = async () => {
    if (!isValidIMEI(imei)) {
      alert("Invalid IMEI");
      return;
    }

    try {
      await CommandAPI.createCommand({
        device_id: imei,
        power: newCommand.command,
      });

      setOpen(false);
      setNewCommand({ command: "" });
      fetchCommands();
    } catch (err) {
      console.error("Create command failed", err);
    }
  };

  const isValidIMEI = (imei: string) => {
    return /^\d{15}$/.test(imei);
  };

  const fetchCommands = async () => {
    if (!isValidIMEI(imei)) return;

    try {
      const data = await CommandAPI.fetchCommandsByIMEI(imei);
      setCommands(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateCommands = async () => {
    if (!isValidIMEI(imei)) {
      alert("Invalid IMEI");
      return;
    }

    try {
      setLoading(true);
      await CommandAPI.generateBasicCommands(imei);
      fetchCommands();
    } catch (err) {
      console.error("Failed to generate commands", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!imei) return;

    fetchCommands();

    const interval = setInterval(() => {
      fetchCommands();
    }, 10000);

    return () => clearInterval(interval);
  }, [imei]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Device Commands</CardTitle>
        </CardHeader>

        <CardContent>
          {/* IMEI Input */}
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Enter Device IMEI"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              className="max-w-xs"
            />

            <Button
              onClick={generateCommands}
              disabled={!isValidIMEI(imei) || loading}
            >
              {loading ? "Generating..." : "Generate Basic Commands"}
            </Button>

            {/* 🔥 Create Command Button */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">+ Create Command</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Command</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 relative">
                  <Input
                    placeholder="Command (e.g. RELAY,0#)"
                    value={newCommand.command}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  />

                  {/* 🔽 Dropdown */}
                  {showDropdown && filteredCommands.length > 0 && (
                    <div className="absolute w-full bg-white border rounded-md shadow-md max-h-40 overflow-y-auto z-50">
                      {filteredCommands.map((cmd, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm font-mono"
                          onClick={() => {
                            setNewCommand({ command: cmd });
                            setShowDropdown(false);
                          }}
                        >
                          {cmd}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button onClick={handleCreateCommand} className="w-full">
                    Create Command 🚀
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Center Number</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {commands.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-6"
                    >
                      No commands found
                    </TableCell>
                  </TableRow>
                )}

                {commands.map((cmd) => (
                  <TableRow key={cmd._id}>
                    <TableCell className="font-mono">{cmd.device_id}</TableCell>

                    <TableCell className="font-mono">{cmd.power}</TableCell>

                    <TableCell>{cmd.command_type}</TableCell>

                    <TableCell>{cmd.center_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
