'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, X } from 'lucide-react'

interface CreateCollectionFormProps {
    onSuccess?: () => void
}

interface UploadedFile {
    name: string
    size: string
}

const availableSkills = ['Frontend', 'Backend', 'ML', 'Python', 'Design', 'DevOps']

export function CreateCollectionForm({ onSuccess }: CreateCollectionFormProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = e.dataTransfer.files
        handleFiles(files)
    }

    const handleFiles = (files: FileList) => {
        const newFiles: UploadedFile[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
            newFiles.push({
                name: file.name,
                size: `${sizeInMB} MB`
            })
        }
        setUploadedFiles([...uploadedFiles, ...newFiles])
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    }

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log('Files:', uploadedFiles)
        console.log('Skills:', selectedSkills)
        onSuccess?.()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold">File Upload</h3>
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                        <div className="flex justify-center mb-2">
                            <Upload size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">
                            Drag and drop or select file
                        </p>
                    </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">📄</span>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skill Verify Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold">Skill Verify</h3>
                <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1 rounded-full text-sm transition ${
                                selectedSkills.includes(skill)
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={uploadedFiles.length === 0 || selectedSkills.length === 0}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
                Upload
            </Button>
        </form>
    )
}
