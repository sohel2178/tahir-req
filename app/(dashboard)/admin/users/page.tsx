"use client";

import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { User } from "@/types/user";
import { UserAPI } from "@/lib/api";

import CreateUserDialog from "@/components/users/CreateUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalPages = Math.ceil(total / limit);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await UserAPI.adminUsers(
        page,
        limit,
        search
      );

      setUsers(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced Search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleCreated = () => fetchUsers();
  const handleUpdated = () => fetchUsers();
  const handleDeleted = () => fetchUsers();

  return (
    <div className="flex h-screen flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <h1 className="text-2xl font-bold">
          👥 Users ({total})
        </h1>

        <div className="flex gap-3">
          <input
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            className="border rounded-md px-3 py-2 w-62.5"
          />

          <Button
            onClick={() => setCreateOpen(true)}
          >
            + Create User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden flex flex-col flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            )}

            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}

            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.name}
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    {user.role}
                  </span>
                </TableCell>

                <TableCell>
                  {user.contact || "-"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>Rows:</span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            Prev
          </Button>

          <span>
            Page {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={createOpen}
        setOpen={setCreateOpen}
        onUserCreated={handleCreated}
      />

      <EditUserDialog
        open={editOpen}
        setOpen={setEditOpen}
        user={selectedUser}
        onUserUpdated={handleUpdated}
      />

      <DeleteUserDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        user={selectedUser}
        onUserDeleted={handleDeleted}
      />
    </div>
  );
}