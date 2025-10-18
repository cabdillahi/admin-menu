// "use client";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useDeleteUserMutation } from "@/services/user/user-api";
// import { useToast } from "@/hooks/use-toast";
// import type { User } from "@/services/types/user-type";

// interface DeleteUserDialogProps {
//   user: User;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function DeleteUserDialog({
//   user,
//   open,
//   onOpenChange,
// }: DeleteUserDialogProps) {
//   const [deleteUser, { isLoading }] = useDeleteUserMutation();
//   const { toast } = useToast();

//   const handleDelete = async () => {
//     try {
//       await deleteUser(user.id).unwrap();
//       toast({
//         title: "Success",
//         description: "User deleted successfully",
//       });
//       onOpenChange(false);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete user",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will permanently delete the user <strong>{user.name}</strong> (
//             {user.email}). This action cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleDelete}
//             disabled={isLoading}
//             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//           >
//             {isLoading ? "Deleting..." : "Delete"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
