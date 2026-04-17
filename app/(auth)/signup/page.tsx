
import Link from "next/link"
import { Book } from "lucide-react"
import SignUpForm from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="max-h-svh lg:grid lg:grid-cols-2">
      <div className="flex flex-col p-6">
        <Link href="/">
          <h1 className="text-md mb-8 flex items-center gap-2 font-semibold">
            <Book /> Skill Collection
          </h1>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="p-6 w-full h-full max-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/wallpaperNoodle.png"
          alt="Sign Up"
          className="h-full w-full object-cover dark:invert rounded-xl"
        />
      </div>
    </div>
  )
}
