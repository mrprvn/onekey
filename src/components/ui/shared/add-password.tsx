import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { addPassword } from "@/lib/firebase-auth";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { PasswordType } from "@/app/page";
import { usePasswordStore } from "@/lib/password-store";
import { encryptText } from "@/lib/crypto";

const AddPassword = ({ userId }: { userId: string }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const setPasswords = usePasswordStore((state) => state.setPasswords);

  const handleSubmit = async () => {
    const encryptedPassword = await encryptText(password, masterKey);
    await addPassword(userId, {
      title: name,
      username,
      password: encryptedPassword,
      note: notes,
    });
    setName("");
    setUsername("");
    setPassword("");
    setNotes("");
    setIsDialogOpen(false);
  };

  useEffect(() => {
    try {
      if (!userId) return;
      const passwordsRef = collection(db, "users", userId, "passwords");

      const unsubscribe = onSnapshot(
        passwordsRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PasswordType[];
          setPasswords(data);
        },
        (err) => {
          console.error("Error fetching passwords:", err);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, [userId, setPasswords]);

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Store your credentials securely.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              placeholder="Website or App Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Master Key"
                type="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPassword;
