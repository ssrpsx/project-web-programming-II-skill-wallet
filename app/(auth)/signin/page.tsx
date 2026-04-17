import SignInForm from "@/components/auth/signin-form"
import Link from "next/link"
import { Book } from "lucide-react"

export default function SignInPage() {
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
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="p-6 w-full h-full max-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/wallpaper.png"
          alt="Sign In"
          className="h-full w-full object-cover dark:invert rounded-xl"
        />
      </div>
    </div>
  )
}
