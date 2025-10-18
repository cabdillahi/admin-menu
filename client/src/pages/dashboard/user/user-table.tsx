"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useGetCustomersQuery } from "@/services/customer/customer-api";
import UserSkeleton from "./user-skeleton";
import CreateUserDialog from "./create-user-dialog";
import type { User } from "@/services/types/user-type";
import { useGetUsersQuery } from "@/services/auth/auth-api";
import { TableHeaderUI } from "../table-header";
import UpdateUserDialog from "./update-user";

export default function UsersTable() {
  const { data: usersData, isLoading, refetch } = useGetUsersQuery();
  const { data: customersData } = useGetCustomersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const users = usersData?.data || [];

  // Create a map of tenant IDs to tenant names for quick lookup
  const tenantMap = new Map(
    customersData?.map((tenant) => [tenant.id, tenant.name]) || []
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenantMap
        .get(user.tenantId)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-4">
      <TableHeaderUI
        title="Users"
        description="Manage system users and their access"
        searchPlaceholder="Search users..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetch}
        actions={<CreateUserDialog />}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UserSkeleton />
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {tenantMap.get(user.tenantId) || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <UpdateUserDialog
            user={selectedUser}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
          />
        </>
      )}
    </div>
  );
}
