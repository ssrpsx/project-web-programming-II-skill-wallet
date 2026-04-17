"use client"

import { logOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut as LogOutIcon } from "lucide-react"

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await logOut()
      }}
      className="w-full justify-start"
    >
      <LogOutIcon size={16} />
      <span>Log out</span>
    </Button>
  )
}
