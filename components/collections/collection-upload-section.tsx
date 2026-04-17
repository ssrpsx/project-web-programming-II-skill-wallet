import { FileText } from 'lucide-react'
import { Upload } from '@/lib/collection-detail-data'

interface CollectionUploadSectionProps {
    uploads: Upload[]
}

export function CollectionUploadSection({ uploads }: CollectionUploadSectionProps) {
    return (
        <div className="space-y-4 w-1/2">
            <h2 className="font-bold text-base">Upload <span className="text-gray-500">{uploads.length} items</span></h2>
            <div className="space-y-3">
                {uploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <span className="text-lg"><FileText size={18} /></span>
                            <span className="">{upload.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{upload.size}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
