import Link from 'next/link'
import {
    Item,
    ItemTitle,
    ItemDescription,
    ItemContent,
    ItemActions,
} from "@/components/ui/item"
import { Collection } from '@/lib/collections-data'
import { ChevronRight } from 'lucide-react'

interface CollectionItemProps {
    collection: Collection
}

export function CollectionItem({ collection }: CollectionItemProps) {
    const isApproved = collection.status === 'approved'
    const icon = isApproved ? '✓' : '📋'
    const dateLabel = isApproved ? 'Approved' : 'Submitted'

    return (
        <Link href={`/app/collections/${collection.id}`} className="no-underline">
            <Item variant="outline" className="cursor-pointer hover:bg-gray-50 transition">
                <ItemContent className="flex-row items-start flex-1">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Icon */}
                        <div className="text-2xl w-8">{icon}</div>

                        {/* Project Name Column */}
                        <div className="w-48">
                            <ItemTitle className="text-base whitespace-nowrap">{collection.name}</ItemTitle>
                        </div>

                        {/* Skills Column */}
                        <div className="flex-1">
                            <ItemDescription className="m-0 text-xs">
                                {collection.skills}
                            </ItemDescription>
                        </div>

                        {/* Date Column */}
                        <div className="w-32">
                            <p className="text-xs text-gray-500 whitespace-nowrap">{dateLabel} {collection.date}</p>
                        </div>
                    </div>
                </ItemContent>

                {/* Action */}
                <ItemActions className="ml-4">
                    <button className="p-2 hover:bg-gray-100 rounded transition">
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </ItemActions>
            </Item>
        </Link>
    )
}
