import { Button } from '@/components/ui/button'
import { CollectionDetail } from '@/lib/collection-detail-data'

interface CollectionDetailHeaderProps {
    collection: CollectionDetail
}

export function CollectionDetailHeader({ collection }: CollectionDetailHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{collection.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Status : <span className="font-semibold text-gray-900">
                        {collection.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                </p>
            </div>
            <div className="text-right">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 mb-2">Go verify</Button>
                <p className="text-gray-500 text-sm">Upload date : {collection.date}</p>
            </div>
        </div>
    )
}
