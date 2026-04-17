"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signUp } from "@/lib/actions/auth"
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
import { Button } from "../ui/button"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Signing up..." : "Sign Up"}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, {})

  return (
    <div>
      <FieldSet>
        <h3 className="text-2xl font-medium text-center p-4">Sign Up</h3>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                required
                minLength={2}
              />
            </Field>
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
                autoComplete="new-password"
                placeholder="password"
                required
                minLength={6}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="password"
                required
              />
            </Field>
            {state.error && (
              <FieldError className="text-red-600">{state.error}</FieldError>
            )}
            <Field className="my-4">
              <FieldDescription className="">
                Already have an account? <Link href="/signin">Sign in</Link>
              </FieldDescription>
              <SubmitButton />
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  )
}
