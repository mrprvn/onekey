// components/password-generator.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Copy, RefreshCw, Check } from "lucide-react"
import {
  generateRandomPassword,
  generateMemorablePassword,
  generatePin,
  calculatePasswordStrength,
  getStrengthColor,
  getStrengthText,
} from "@/lib/password-utils"

interface PasswordGeneratorProps {
  onInsert?: (password: string) => void
}

export function PasswordGenerator({ onInsert }: PasswordGeneratorProps) {

  // State for Random Password mode
  const [randomLength, setRandomLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  // State for Memorable/Passphrase mode
  const [wordCount, setWordCount] = useState(4)
  const [memorableSeparator, setMemorableSeparator] = useState("-")
  const [capitalizeWords, setCapitalizeWords] = useState(false)

  // State for PIN mode
  const [pinLength, setPinLength] = useState(6)

  // General state
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [currentMode, setCurrentMode] = useState("random")
  const [copySuccess, setCopySuccess] = useState(false)

  const generatePassword = useCallback(() => {
    let newPassword = ""
    if (currentMode === "random") {
      newPassword = generateRandomPassword(
        randomLength,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous,
      )
    } else if (currentMode === "memorable") {
      newPassword = generateMemorablePassword(wordCount, memorableSeparator, capitalizeWords)
    } else if (currentMode === "pin") {
      newPassword = generatePin(pinLength)
    }
    setGeneratedPassword(newPassword)
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }, [
    currentMode,
    randomLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    wordCount,
    memorableSeparator,
    capitalizeWords,
    pinLength,
  ])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleInsert = () => {
    if (onInsert) {
      onInsert(generatedPassword)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
      <Tabs value={currentMode} onValueChange={setCurrentMode} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger className="cursor-pointer" value="random">Random</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="memorable">Memorable</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="pin">PIN</TabsTrigger>
        </TabsList>

        <TabsContent value="random" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="random-length">Length: {randomLength}</Label>
            <Slider
            className="cursor-pointer"
              id="random-length"
              min={4}
              max={64}
              step={1}
              value={[randomLength]}
              onValueChange={([val]) => setRandomLength(val)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
              <Switch className="cursor-pointer" id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
              <Switch className="cursor-pointer" id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Numbers (0-9)</Label>
              <Switch className="cursor-pointer" id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Symbols (!@#$)</Label>
              <Switch className="cursor-pointer" id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <Label htmlFor="ambiguous">Exclude Ambiguous (l,1,O,0)</Label>
              <Switch className="cursor-pointer" id="ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="memorable" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="word-count">Word Count: {wordCount}</Label>
            <Slider
            className="cursor-pointer"
              id="word-count"
              min={3}
              max={10}
              step={1}
              value={[wordCount]}
              onValueChange={([val]) => setWordCount(val)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="separator">Separator</Label>
            <Input
              id="separator"
              value={memorableSeparator}
              onChange={(e) => setMemorableSeparator(e.target.value)}
              maxLength={5}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="capitalize-words">Capitalize Words</Label>
            <Switch className="cursor-pointer" id="capitalize-words" checked={capitalizeWords} onCheckedChange={setCapitalizeWords} />
          </div>
        </TabsContent>

        <TabsContent value="pin" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="pin-length">PIN Length: {pinLength}</Label>
            <Slider
            className="cursor-pointer"
              id="pin-length"
              min={4}
              max={12}
              step={1}
              value={[pinLength]}
              onValueChange={([val]) => setPinLength(val)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-4 space-y-2">
        <Label htmlFor="generated-password">Generated Password</Label>
        <Input id="generated-password" type="text" value={generatedPassword} readOnly className="font-mono text-lg" />
        <div className="flex items-center gap-2">
          <Progress
            value={passwordStrength * 25}
            className="h-2 flex-grow"
          />
          <span className="text-sm text-muted-foreground">{getStrengthText(passwordStrength)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button onClick={handleCopy} className="flex-1 bg-transparent cursor-pointer" variant="outline">
          {copySuccess ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copySuccess ? "Copied!" : "Copy"}
        </Button>
        <Button onClick={generatePassword} className="flex-1 bg-transparent cursor-pointer" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
        {onInsert && (
          <Button onClick={handleInsert} className="flex-1 cursor-pointer">
            Insert to Field
          </Button>
        )}
      </div>
    </div>
  )
}
