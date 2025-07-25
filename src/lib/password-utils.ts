// lib/password-utils.ts

import { MEMORABLE_WORDS } from "./memorable-words"

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?"
const AMBIGUOUS_CHARS = "lLiIoO0" // Characters to exclude if option is enabled



/**
 * Generates a random password based on specified criteria.
 */
export function generateRandomPassword(
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  excludeAmbiguous: boolean,
): string {
  let characterPool = ""
  if (includeLowercase) characterPool += LOWERCASE_CHARS
  if (includeUppercase) characterPool += UPPERCASE_CHARS
  if (includeNumbers) characterPool += NUMBERS
  if (includeSymbols) characterPool += SYMBOLS

  if (excludeAmbiguous) {
    characterPool = characterPool
      .split("")
      .filter((char) => !AMBIGUOUS_CHARS.includes(char))
      .join("")
  }

  if (characterPool.length === 0) {
    return "" // No characters selected
  }

  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length)
    password += characterPool[randomIndex]
  }
  return password
}

/**
 * Generates a memorable passphrase from a list of words.
 */
export function generateMemorablePassword(wordCount: number, separator: string, capitalize: boolean): string {
  if (wordCount <= 0) return ""

  const selectedWords: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * MEMORABLE_WORDS.length)
    let word = MEMORABLE_WORDS[randomIndex]
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    selectedWords.push(word)
  }
  return selectedWords.join(separator)
}

/**
 * Generates a numeric PIN.
 */
export function generatePin(length: number): string {
  let pin = ""
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10) // 0-9
  }
  return pin
}

/**
 * Calculates a simple password strength score (0-4).
 * This is a basic implementation; for production, consider libraries like zxcvbn.
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password)

  const characterTypes = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length

  if (characterTypes >= 2) score++
  if (characterTypes >= 3) score++
  if (characterTypes >= 4) score++

  // Cap score at 4 for simplicity
  return Math.min(score, 4)
}

export function getStrengthColor(strength: number): string {
  switch (strength) {
    case 0:
      return "bg-gray-400" // Very Weak
    case 1:
      return "bg-red-500" // Weak
    case 2:
      return "bg-orange-500" // Fair
    case 3:
      return "bg-yellow-500" // Good
    case 4:
      return "bg-green-500" // Strong
    default:
      return "bg-gray-400"
  }
}

export function getStrengthText(strength: number): string {
  switch (strength) {
    case 0:
      return "Very Weak"
    case 1:
      return "Weak"
    case 2:
      return "Fair"
    case 3:
      return "Good"
    case 4:
      return "Strong"
    default:
      return "Unknown"
  }
}
