import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  mimetype: string;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveFile(
  file: Buffer,
  originalName: string,
  mimetype: string
): Promise<UploadedFile> {
  await ensureUploadDir();
  
  const id = uuidv4();
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${id}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  
  await fs.writeFile(filepath, file);
  
  return {
    id,
    originalName,
    filename,
    path: filepath,
    url: `/uploads/${filename}`,
    size: file.length,
    mimetype,
  };
}

export async function deleteFile(filename: string): Promise<void> {
  const filepath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(filepath);
  } catch {
    // File doesn't exist, ignore
  }
}

export function validateFileType(mimetype: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ];
  return allowedTypes.includes(mimetype);
}

export function validateFileSize(size: number, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}