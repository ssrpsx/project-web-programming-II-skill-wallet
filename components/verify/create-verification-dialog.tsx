"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateVerificationForm } from "./create-verification-form"
import { PlusCircle } from "lucide-react"
import type { User, Skill } from "@/lib/api/types"

interface CreateVerificationDialogProps {
  user: User | null
  skills: Skill[]
}

export function CreateVerificationDialog({
  user,
  skills,
}: CreateVerificationDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        className="bg-black text-white hover:bg-gray-800"
      >
        <PlusCircle size={18} />
        <span>New Verification</span>
      </Button>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Verification</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Select a skill to begin the verification process.
          </p>
        </DialogHeader>
        <CreateVerificationForm
          user={user}
          skills={skills}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
