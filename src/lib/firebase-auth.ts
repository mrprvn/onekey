import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const addUser = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Failed to add user:", error);
    throw error;
  }
};

export async function addPassword(
  userId: string,
  data: {
    title: string;
    username: string;
    password: string;
    note?: string;
  }
): Promise<string | null> {
  try {
    const passwordsRef = collection(db, "users", userId, "passwords");

    const docRef = await addDoc(passwordsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding password:", error);
    return null;
  }
}

export async function getAllPasswords(user: User) {
  try {
    if (!user?.uid) return;
    const passwordsRef = collection(db, "users", user?.uid, "passwords");

    const unsubscribe = onSnapshot(
      passwordsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return data;
      },
      (err) => {
        console.error("Error fetching passwords:", err);
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

export async function deletePassword(userId: string, passwordId: string) {
  try {
    const passwordRef = doc(db, "users", userId, "passwords", passwordId);
    await deleteDoc(passwordRef);
  } catch (error) {
    console.error("Failed to delete password:", error);
    throw error;
  }
}

export async function editPassword(
  userId: string,
  passwordId: string,
  updatedData: {
    title?: string;
    username?: string;
    password?: string;
  }
): Promise<void> {
  try {
    const passwordRef = doc(db, "users", userId, "passwords", passwordId);

    await updateDoc(passwordRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    console.log("Password updated successfully");
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
}
