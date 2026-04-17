"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { apiFetch } from "@/lib/api/server"
import type { AuthResponse } from "@/lib/api/types"

export async function signIn(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const data = await apiFetch<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    const cookieStore = await cookies()
    cookieStore.set("token", data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }

  redirect("/app")
}

export async function signUp(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const name = formData.get("name") as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  try {
    const data = await apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })

    const cookieStore = await cookies()
    cookieStore.set("token", data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }

  redirect("/app")
}

export async function logOut() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  redirect("/signin")
}
