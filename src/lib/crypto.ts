// lib/crypto.ts
export const generateKeyFromMaster = async (masterKey: string) => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(masterKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("some-random-salt"), // keep consistent
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptText = async (plainText: string, masterKey: string) => {
  const key = await generateKeyFromMaster(masterKey);
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  const buffer = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...buffer));
};

export const decryptText = async (
  cipherText: string,
  masterKey: string
): Promise<
  { success: true; data: string } | { success: false; error: string }
> => {
  try {
    const key = await generateKeyFromMaster(masterKey);
    const buffer = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

    const iv = buffer.slice(0, 12);
    const data = buffer.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return { success: true, data: new TextDecoder().decode(decrypted) };
  } catch (err) {
    return {
      success: false,
      error: `${err} Incorrect master key or corrupted data.`,
    };
  }
};
