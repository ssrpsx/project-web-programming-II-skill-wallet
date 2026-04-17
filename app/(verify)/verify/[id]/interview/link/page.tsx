import { apiFetch } from "@/lib/api/server"
import type { Verification } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface InterviewLinkPageProps {
  params: Promise<{
    id: string
  }>
}

async function getVerification(id: string): Promise<Verification | null> {
  try {
    return await apiFetch<Verification>(`/verifications/${id}`)
  } catch {
    return null
  }
}

export default async function InterviewLinkPage({
  params,
}: InterviewLinkPageProps) {
  const { id } = await params
  const verification = await getVerification(id)

  if (!verification) {
    return <div className="text-center py-12">Verification not found</div>
  }

  const interviewLevel = verification.levelData.find(
    (l) => l.level === "interview"
  )
  const meetLink = interviewLevel?.link || "https://meet.google.com"

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Interview</h1>
      <p className="text-gray-600 mb-12">
        Join your scheduled video interview with our industry experts.
      </p>

      <div className="flex justify-center mb-8">
        <ExternalLink size={48} className="text-gray-400" />
      </div>

      <a href={meetLink} target="_blank" rel="noopener noreferrer">
        <Button className="bg-black text-white w-full">Join Interview</Button>
      </a>
    </div>
  )
}
