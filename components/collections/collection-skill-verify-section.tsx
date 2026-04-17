import { Badge } from '@/components/ui/badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Check, X } from 'lucide-react'
import { SkillVerifyItem } from '@/lib/collection-detail-data'

interface CollectionSkillVerifySectionProps {
    skillVerify: SkillVerifyItem[]
}

export function CollectionSkillVerifySection({ skillVerify }: CollectionSkillVerifySectionProps) {
    return (
        <div className="space-y-4 w-1/2">
            <h2 className="font-bold text-base">Skill verify</h2>
            <Accordion type="single" collapsible className="">
                {skillVerify.map((skillItem, index) => (
                    <AccordionItem key={index} value={`skill-${index}`}>
                        <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                            <div className="flex items-center gap-3 text-left">
                                {skillItem.status === 'approved' ? (
                                    <span className="text-lg text-green-600"><Check size={20} /></span>
                                ) : (
                                    <span className="text-lg text-red-600"><X size={20} /></span>
                                )}
                                <span className="font-medium flex-1">{skillItem.skill}</span>
                                <Badge 
                                    className={`${
                                        skillItem.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    } border-0 ml-4`}
                                >
                                    {skillItem.response}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-gray-50 text-sm text-gray-600">
                            {skillItem.reason || 'No additional information provided.'}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
