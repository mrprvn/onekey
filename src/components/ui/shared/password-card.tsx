import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { PasswordType } from "@/app/page";
import { Input } from "../input";
import { decryptText } from "@/lib/crypto";
import { Label } from "../label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import PassowrdMenu from "./password-menu";

const PassowrdCard = ({ password }: { password: PasswordType }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [masterKeyError, setMasterKeyError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(
    new Set()
  );
  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Map<string, string>
  >(new Map());

  const copyToClipboard = async (password: string, passwordId: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(passwordId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  const handleViewPassword = (passwordId: string) => {
    if (revealedPasswords.has(passwordId)) {
      const newRevealed = new Set(revealedPasswords);
      newRevealed.delete(passwordId);
      setRevealedPasswords(newRevealed);
    } else {
      setSelectedEntry(passwordId);
      setShowDialog(true);
      setMasterKey("");
      setMasterKeyError("");
    }
  };

  const handleMasterKeySubmit = async () => {
    const decryptedPassword = await decryptText(password.password, masterKey);
    if (decryptedPassword.success) {
      const newRevealed = new Set(revealedPasswords);
      const newDecrypted = new Map(decryptedPasswords);
      if (selectedEntry !== null) {
        newRevealed.add(selectedEntry);
        newDecrypted.set(selectedEntry, decryptedPassword.data);
      }
      setDecryptedPasswords(newDecrypted);
      setRevealedPasswords(newRevealed);
      setShowDialog(false);
      setSelectedEntry(null);
      setMasterKey("");
      setMasterKeyError("");
    } else {
      setMasterKeyError("Incorrect master key. Please try again.");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg capitalize">
              {password.title}
            </CardTitle>
          </div>
          <PassowrdMenu password={password} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Username</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-mono truncate flex-1">
                {password.username}
              </p>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Password</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-mono flex-1 line-clamp-3">
                {revealedPasswords.has(password.id) &&
                decryptedPasswords.has(password.id)
                  ? decryptedPasswords.get(password.id)
                  : "●●●●●●●●"}
              </p>
              <div className="flex gap-1">
                {revealedPasswords.has(password.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 cursor-pointer"
                    onClick={() => {
                      const decrypted = decryptedPasswords.get(password.id);
                      if (decrypted) {
                        copyToClipboard(decrypted, password.id);
                      }
                    }}
                    disabled={!decryptedPasswords.has(password.id)} // optional
                  >
                    {copiedId === password.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 cursor-pointer"
                  onClick={() => handleViewPassword(password.id)}
                >
                  {revealedPasswords.has(password.id) ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          {
            password?.note && <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-mono truncate flex-1">
                {password.note}
              </p>
            </div>
          </div>
          }
       
        </div>
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Master Key</DialogTitle>
            <DialogDescription>
              Please enter your master key to view the password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="masterKey">Master Key</Label>
              <Input
                id="masterKey"
                type="password"
                value={masterKey}
                onChange={(e) => {
                  setMasterKey(e.target.value);
                  setMasterKeyError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleMasterKeySubmit();
                  }
                }}
                placeholder="Enter your master key"
                className={masterKeyError ? "border-red-500" : ""}
              />
              {masterKeyError && (
                <p className="text-sm text-red-500">{masterKeyError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMasterKeySubmit}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PassowrdCard;
