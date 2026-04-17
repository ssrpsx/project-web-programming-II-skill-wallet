"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signIn } from "@/lib/actions/auth"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export default function SignInForm() {
  const [state, formAction] = useActionState(signIn, {})

  return (
    <div>
      <FieldSet>
        <h3 className="p-4 text-center text-2xl font-medium">Sign In</h3>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="password"
                required
              />
            </Field>
            {state.error && (
              <FieldError className="text-red-600">{state.error}</FieldError>
            )}
            <Field className="my-4">
              <FieldDescription className="">
                Don’t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
              <SubmitButton />
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  )
}
