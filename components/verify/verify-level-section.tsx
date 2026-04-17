import {
    ItemGroup,
} from '@/components/ui/item'
import { VerifyLevel } from '@/lib/verify-data'
import { VerifyItemComponent } from './verify-item'

interface VerifyLevelSectionProps {
    level: VerifyLevel
}

export function VerifyLevelSection({ level }: VerifyLevelSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold">{level.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{level.description}</p>
            </div>

            {/* Header Row */}
            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border rounded-lg">
                <div className="w-32">
                    <p className="text-xs font-semibold text-gray-700">Skills</p>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700">Details</p>
                </div>
                <div className="w-24">
                    <p className="text-xs font-semibold text-gray-700">Status</p>
                </div>
                <div className="w-12" />
            </div>

            {/* Items */}
            <ItemGroup>
                {level.items.map((item) => (
                    <VerifyItemComponent key={item.id} item={item} routePath={(item as any).routePath} />
                ))}
            </ItemGroup>
        </div>
    )
}
