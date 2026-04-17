"use server"

import { apiFetch } from "@/lib/api/server"
import type { SubmitResponse, Verification } from "@/lib/api/types"
import { revalidatePath } from "next/cache"

export async function submitQuiz(
  verificationId: string,
  answers: string[]
): Promise<SubmitResponse> {
  return apiFetch<SubmitResponse>(
    `/verifications/${verificationId}/submit`,
    {
      method: "POST",
      body: JSON.stringify({ answers }),
    }
  )
}

export async function retryQuiz(
  verificationId: string
): Promise<Verification> {
  return apiFetch<Verification>(
    `/verifications/${verificationId}/retry`,
    {
      method: "POST",
      body: "{}",
    }
  )
}

export async function createVerification(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const userId = formData.get("userId") as string
  const skillId = formData.get("skillId") as string

  try {
    await apiFetch<Verification>("/verifications", {
      method: "POST",
      body: JSON.stringify({ userId, skillId }),
    })
    revalidatePath("/app/verify")
    return {}
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}
