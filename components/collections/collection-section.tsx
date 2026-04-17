import { Badge } from "@/components/ui/badge"
import {
    ItemGroup,
} from "@/components/ui/item"
import { Collection } from '@/lib/collections-data'
import { CollectionItem } from './collection-item'

interface CollectionSectionProps {
    title: string
    collections: Collection[]
    badgeColor: string
}

export function CollectionSection({ 
    title, 
    collections, 
    badgeColor 
}: CollectionSectionProps) {
    if (collections.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{title}</h2>
                <Badge variant="secondary" className={badgeColor}>
                    {collections.length}
                </Badge>
            </div>

            {/* Header Row */}
            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border rounded-lg">
                <div className="w-8" />
                <div className="w-48">
                    <p className="text-xs font-semibold text-gray-700">Project Name</p>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700">Skills</p>
                </div>
                <div className="w-32">
                    <p className="text-xs font-semibold text-gray-700">Date</p>
                </div>
                <div className="w-12" />
            </div>

            {/* Items */}
            <ItemGroup>
                {collections.map((collection) => (
                    <CollectionItem key={collection.id} collection={collection} />
                ))}
            </ItemGroup>
        </div>
    )
}
