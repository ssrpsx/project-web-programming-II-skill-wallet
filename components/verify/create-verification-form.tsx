"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createVerification } from "@/lib/actions/verifications"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import type { User, Skill } from "@/lib/api/types"

interface CreateVerificationFormProps {
  user: User | null
  skills: Skill[]
  onSuccess: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating..." : "Create Verification"}
    </Button>
  )
}

export function CreateVerificationForm({
  user,
  skills,
  onSuccess,
}: CreateVerificationFormProps) {
  const [state, formAction] = useActionState(createVerification, {})

  if (!user) {
    return <p className="text-red-600">User not found</p>
  }

  return (
    <form
      action={async (formData) => {
        await formAction(formData)
        onSuccess()
      }}
    >
      <FieldGroup>
        <input type="hidden" name="userId" value={user._id} />

        <Field>
          <FieldLabel htmlFor="skillId">Select a Skill</FieldLabel>
          <select
            id="skillId"
            name="skillId"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a skill --</option>
            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.title}
              </option>
            ))}
          </select>
        </Field>

        {state.error && (
          <FieldError className="text-red-600">{state.error}</FieldError>
        )}

        <SubmitButton />
      </FieldGroup>
    </form>
  )
}
