'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ onUploadComplete, maxFiles = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map((f: any) => {
        if (f.errors[0]?.code === 'file-too-large') {
          return `${f.file.name}: File too large (max 10MB)`
        }
        if (f.errors[0]?.code === 'file-invalid-type') {
          return `${f.file.name}: Invalid file type`
        }
        return `${f.file.name}: Upload failed`
      })
      setError(errors.join('. '))
      return
    }

    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - uploadedImages.length} more.`)
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    acceptedFiles.forEach(file => formData.append('images', file))

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      if (data.errors?.length > 0) {
        setError(data.errors.join('. '))
      }

      if (data.files?.length > 0) {
        const newImages = data.files.map((f: any) => ({ url: f.url, name: f.originalName }))
        const updatedImages = [...uploadedImages, ...newImages]
        setUploadedImages(updatedImages)
        onUploadComplete(updatedImages.map(img => img.url))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [uploadedImages, maxFiles, onUploadComplete])

  const removeImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updated)
    onUploadComplete(updated.map(img => img.url))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: maxFiles - uploadedImages.length,
    disabled: uploading || uploadedImages.length >= maxFiles,
  })

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Upload Photos of Your Project Area
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Help us better understand your project. Upload up to 10 images showing the work area, 
          existing conditions, and any relevant details. This improves diagnostic accuracy.
        </p>
      </div>

      {/* Upload Zone */}
      {uploadedImages.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, WebP up to 10MB each
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {uploadedImages.length} of {maxFiles} images uploaded
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({uploadedImages.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}