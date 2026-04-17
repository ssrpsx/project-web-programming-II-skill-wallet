'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { ChevronRight, User } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const [firstName, setFirstName] = useState('Ayaka')
    const [lastName, setLastName] = useState('Yoshino')
    const [birthDate, setBirthDate] = useState('31/1/2001')
    const [photo, setPhoto] = useState<string | null>(null)

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhoto(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account, preferences, and security settings.</p>
            </div>

            {/* Profile Section */}
            <div className="space-y-6">
                {/* Photo Upload */}
                <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={photo || undefined} alt="Profile" />
                        <AvatarFallback className="text-4xl"><User /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <label htmlFor="photo-input" className="cursor-pointer">
                            <Button variant="outline" asChild>
                                <span>Choose Photo</span>
                            </Button>
                        </label>
                        <input
                            id="photo-input"
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/gif"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <p className="text-gray-500 text-sm mt-2">Support JPG, PNG, GIF.</p>
                    </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First name</Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last name</Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border-gray-300"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-gray-700 font-medium">Birth date</Label>
                    <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="border-gray-300 max-w-sm"
                    />
                </div>

                <Separator />

                {/* Sign Out Button */}
                <Button variant="destructive">Sign out</Button>
            </div>

            {/* Settings Information */}
            <Link href="#" className="no-underline">
                <Item variant="outline" className="cursor-pointer">
                    <ItemContent className="flex-row items-center">
                        <span className="text-lg">⚙️</span>
                        <ItemTitle className="ml-3">Settings Your Information</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <ChevronRight size={20} className="text-gray-400" />
                    </ItemActions>
                </Item>
            </Link>
        </div>
    )
}
