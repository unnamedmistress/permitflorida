import { NextRequest, NextResponse } from 'next/server';
import { saveFile, validateFileType, validateFileSize, UploadedFile } from '@/lib/upload';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const files: File[] = [];
    
    // Extract all files from formData
    const entries = Array.from(formData.entries());
    for (const [, value] of entries) {
      if (value instanceof File) {
        files.push(value);
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      );
    }
    
    const uploadedFiles: UploadedFile[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      // Validate file type
      if (!validateFileType(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPG, PNG, WebP, HEIC allowed.`);
        continue;
      }
      
      // Validate file size (10MB max)
      if (!validateFileSize(file.size, 10)) {
        errors.push(`${file.name}: File too large. Maximum 10MB per file.`);
        continue;
      }
      
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save file
      const uploadedFile = await saveFile(buffer, file.name, file.type);
      uploadedFiles.push(uploadedFile);
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename required' },
        { status: 400 }
      );
    }
    
    // Delete file logic here if needed
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}