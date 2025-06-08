import { PasswordType } from "@/app/page";
import { create } from "zustand";

type PasswordStore = {
  passwords: PasswordType[];
  setPasswords: (passwords: PasswordType[]) => void;
};

export const usePasswordStore = create<PasswordStore>((set) => ({
  passwords: [],
  setPasswords: (passwords) => set({ passwords }),
}));
