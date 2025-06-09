import React from "react";
import { User } from "firebase/auth";
import { Button } from "../button";
import { Separator } from "../separator";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Key, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/firebase-auth";
import AddPassword from "./add-password";

const Header = ({ user }: { user: User }) => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.replace("/auth/sign-in");
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="cursor-pointer flex items-center gap-1">
        <Key size={36} strokeWidth={3} />
        <h2 className="text-4xl font-bold tracking-tight select-none">
          OneKey
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <AddPassword userId={user.uid} />
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.photoURL || ""}
              alt={user.displayName || ""}
            />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
