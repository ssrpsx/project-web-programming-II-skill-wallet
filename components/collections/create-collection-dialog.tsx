'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateCollectionForm } from './create-collection-form'

interface CreateCollectionDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateCollectionDialog({ open: controlledOpen, onOpenChange }: CreateCollectionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    const handleOpenChange = (newOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(newOpen)
        } else {
            setInternalOpen(newOpen)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Uploads your project and the CSS used when you're done.
                    </p>
                </DialogHeader>
                <CreateCollectionForm onSuccess={() => handleOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
