'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PeerToPeerPage() {
    const params = useParams()
    const id = params.id as string

    return (
        <div className="max-w-md mx-auto text-center py-12">
            <h1 className="text-3xl font-bold mb-4">P2P Test</h1>
            <p className="text-gray-600 mb-8">
                Submit 2 project samples for peer review. Your projects will be evaluated by at least 2 peers from the community. This is a great opportunity to get feedback from experienced professionals.
            </p>
            <Link href={`/verify/${id}/peartopear/link`}>
                <Button className="bg-black text-white ">
                    Start
                </Button>
            </Link>
        </div>
    )
}

