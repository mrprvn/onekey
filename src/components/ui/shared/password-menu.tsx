import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { PasswordType } from "@/app/page";
import { useUserStore } from "@/lib/user-store";
import { deletePassword, editPassword } from "@/lib/firebase-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Label } from "../label";
import { Input } from "../input";
import { encryptText } from "@/lib/crypto";

const PassowrdMenu = ({ password }: { password: PasswordType }) => {
  const user = useUserStore((state) => state.user);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [masterKey, setMasterKey] = useState("");
  const [formData, setFormData] = useState({
    title: password.title,
    username: password.username,
    password: "",
  });

  const handleEditPassword = async (
    userId: string | undefined,
    passwordId: string
  ) => {
    if (!userId || !passwordId) return;
    const dataToSave: { title?: string; username?: string; password?: string } =
      {
        title: formData.title,
        username: formData.username,
      };

    if (formData.password.trim() !== "") {
      const encryptedPassword = await encryptText(formData.password, masterKey);
      dataToSave.password = encryptedPassword;
    }
    await editPassword(userId, passwordId, dataToSave);
    setShowEditDialog(false);
  };

  const confirmDeletePassword = async (
    userId: string | undefined,
    passwordId: string
  ) => {
    if (!userId || !passwordId) return;
    await deletePassword(userId, passwordId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Password Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleEditPassword(user?.uid, password.id);
            }}
          >
            <DialogHeader>
              <DialogTitle>
                Edit Password for{" "}
                <span className="capitalize">{password.title}</span>
              </DialogTitle>
              <DialogDescription>
                Update the password entry details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Facebook, Gmail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-username">Username / Email *</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="username or email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="master-key">Master Key</Label>
                <Input
                  id="master-key"
                  type="text"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  placeholder="Enter key"
                  required={formData.password ? true : false}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setShowEditDialog(true)}
              >
                Cancel
              </Button>
              <Button className="cursor-pointer" type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the password entry for &#34;
              {password?.title}&#34;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeletePassword(user?.uid, password.id)}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PassowrdMenu;
