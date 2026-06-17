// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { useAuthStore } from "@/store/auth";
// import CreateUserDialog from "@/components/users/CreateUserDialog";
// import { UserAPI } from "@/lib/api";
// import EditUserDialog from "@/components/users/EditUserDialog";
// import DeleteUserDialog from "@/components/users/DeleteUserDialog";
// import { User } from "@/types/user";
// import ClientSearch from "@/components/motion/ClientSearch";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

// export default function UsersPage() {
//   const { token } = useAuthStore();
//   const [users, setUsers] = useState<User[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [tableUsers, setTableUsers] = useState<User[]>([...users]);
//   const parentRef = useRef<HTMLDivElement>(null);

//   const rowVirtualizer = useVirtualizer({
//     count: tableUsers.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 56, // 👈 match header row height
//     overscan: 5,
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     setTableUsers(users);
//   }, [users]);

//   const handleUserCreated = (newUser: User) => {
//     setUsers((prev) => [...prev, newUser]); // ✅ push new user locally
//   };

//   const handleUserUpdated = (updated: User) => {
//     setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
//   };

//   const handleUserDeleted = (id: string) => {
//     setUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   const fetchUsers = async () => {
//     try {
//       const data = await UserAPI.list();
//       setUsers(data);
//     } catch (err) {
//       console.error("❌ Failed to fetch users", err);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     await axios.delete(`${API_URL}/users/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchUsers();
//   };

//   return (
//     <div className="flex h-screen w-full flex-col overflow-hidden p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">👥 Users</h1>
//         <div className="flex items-center gap-4">
//           <ClientSearch
//             callback={setTableUsers}
//             data={users}
//             fields={["name", "email"]}
//             imgSrc="/icons/search.svg"
//             placeholder="Search users.."
//             otherClasses="w-[300px] lg:w-[400px]"
//           />
//           <Button onClick={() => setOpen(true)}>+ Create User</Button>
//         </div>
//       </div>

//       {/* Virtualized Table */}
//       <div ref={parentRef} className="flex-1 overflow-auto">
//         <Table className="relative w-full border">
//           <TableHeader className="sticky top-0 bg-gray-100 z-10">
//             <TableRow>
//               <TableHead>Email</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody
//             style={{
//               height: `${rowVirtualizer.getTotalSize()}px`,
//               position: "relative",
//             }}
//           >
//             {rowVirtualizer.getVirtualItems().map((virtualRow) => {
//               const user = tableUsers[virtualRow.index];
//               return (
//                 <TableRow
//                   key={user.id}
//                   ref={(node) => {
//                     if (node) rowVirtualizer.measureElement(node);
//                   }}
//                   data-index={virtualRow.index}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     transform: `translateY(${virtualRow.start}px)`,
//                   }}
//                   className="grid grid-cols-4 items-center"
//                 >
//                   <TableCell className="truncate">{user.email}</TableCell>
//                   <TableCell>{user.name}</TableCell>
//                   <TableCell>
//                     <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
//                       {user.role}
//                     </span>
//                   </TableCell>
//                   <TableCell className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedUser(user);
//                         setEditOpen(true);
//                       }}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedUser(user);
//                         setDeleteOpen(true);
//                       }}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>

//       <CreateUserDialog
//         open={open}
//         setOpen={setOpen}
//         onUserCreated={handleUserCreated}
//       />

//       <EditUserDialog
//         open={editOpen}
//         setOpen={setEditOpen}
//         user={selectedUser}
//         onUserUpdated={handleUserUpdated}
//       />
//       <DeleteUserDialog
//         open={deleteOpen}
//         setOpen={setDeleteOpen}
//         user={selectedUser}
//         onUserDeleted={handleUserDeleted}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth";
import CreateUserDialog from "@/components/users/CreateUserDialog";
import { UserAPI } from "@/lib/api";
import EditUserDialog from "@/components/users/EditUserDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import { User } from "@/types/user";
import ClientSearch from "@/components/motion/ClientSearch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

export default function UsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tableUsers, setTableUsers] = useState<User[]>([...users]);
  const [isScrolled, setIsScrolled] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tableUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setTableUsers(users);
  }, [users]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const handleScroll = () => setIsScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserAPI.list();
      setUsers(data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
    }
  };

  const handleUserCreated = (newUser: User) =>
    setUsers((prev) => [...prev, newUser]);

  const handleUserUpdated = (updated: User) =>
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  const handleUserDeleted = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          👥 Users({tableUsers.length})
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <ClientSearch
            callback={setTableUsers}
            data={users}
            fields={["name", "email"]}
            imgSrc="/icons/search.svg"
            placeholder="Search users.."
            otherClasses="w-full sm:w-[300px] lg:w-[400px]"
          />

          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            + Create User
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        {/* Sticky header */}
        <div
          className={`sticky top-0 z-20 bg-gray-100 transition-shadow ${
            isScrolled ? "shadow-md" : ""
          } hidden sm:block`}
        >
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="grid grid-cols-4 text-sm sm:text-base font-semibold">
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Virtualized Body */}
        <div ref={parentRef} className="hidden sm:block flex-1 overflow-auto">
          <Table className="relative w-full table-fixed">
            <TableBody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const user = tableUsers[virtualRow.index];
                return (
                  <TableRow
                    key={user.id}
                    ref={(node) => {
                      if (node) rowVirtualizer.measureElement(node);
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-4 items-center text-sm sm:text-base"
                  >
                    <TableCell className="truncate">{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
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

        {/* 📱 Mobile Card View */}
        <div className="sm:hidden flex flex-col overflow-y-auto gap-3 p-1">
          {tableUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-base">{user.name}</h2>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
              <p className="text-sm truncate">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <div className="flex justify-end gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={open}
        setOpen={setOpen}
        onUserCreated={handleUserCreated}
      />
      <EditUserDialog
        open={editOpen}
        setOpen={setEditOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
      <DeleteUserDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        user={selectedUser}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}
