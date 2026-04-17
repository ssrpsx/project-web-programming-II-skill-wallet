'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function InterviewPage() {
    const params = useParams()
    const id = params.id as string

    return (
        <div className="max-w-md mx-auto text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Interview Test</h1>
            <p className="text-gray-600 mb-8">
                Get interviewed by experienced professionals. Answer questions about your expertise and experience in a 1-on-1 interview format. This is your chance to showcase your skills and knowledge.
            </p>
            <Link href={`/verify/${id}/interview/link`}>
                <Button className="bg-black text-white ">
                    Start
                </Button>
            </Link>
        </div>
    )
}

