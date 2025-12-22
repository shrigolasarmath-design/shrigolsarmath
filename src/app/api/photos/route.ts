import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const STORAGE_DIR = join(process.cwd(), 'public/uploads/photos');

// Ensure storage directory exists
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

interface PhotoData {
  id: string;
  caption: string;
  uploadedAt: string;
  fileExt?: string;
}

let photosIndex: PhotoData[] = [];
const indexFile = join(STORAGE_DIR, 'index.json');

// Load photos index on startup
async function loadIndex() {
  try {
    const data = await readFile(indexFile, 'utf-8');
    photosIndex = JSON.parse(data);
  } catch {
    photosIndex = [];
  }
}

loadIndex();

export async function GET() {
  try {
    await loadIndex();
    const photos = photosIndex.map(photo => ({
      id: photo.id,
      caption: photo.caption,
      uploadedAt: photo.uploadedAt,
      imageUrl: `/uploads/photos/${photo.id}.${photo.fileExt || 'jpg'}`
    }));
    return Response.json(photos);
  } catch (error) {
    return Response.json({ error: 'Failed to load photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get file extension
    const fileExt = file.type.split('/')[1] || 'jpg';
    const photoId = Date.now().toString();
    const buffer = await file.arrayBuffer();
    
    // Save image with proper extension
    const imagePath = join(STORAGE_DIR, `${photoId}.${fileExt}`);
    await writeFile(imagePath, Buffer.from(buffer));

    // Update index
    const photoData: PhotoData = {
      id: photoId,
      caption,
      fileExt,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    photosIndex.push(photoData);
    await writeFile(indexFile, JSON.stringify(photosIndex, null, 2));

    return Response.json({
      id: photoId,
      caption,
      uploadedAt: photoData.uploadedAt,
      imageUrl: `/uploads/photos/${photoId}.${fileExt}`
    });
  } catch (error) {
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { photoId } = await request.json();

    // Remove from index
    photosIndex = photosIndex.filter(p => p.id !== photoId);
    await writeFile(indexFile, JSON.stringify(photosIndex, null, 2));

    // Remove image file
    const imagePath = join(STORAGE_DIR, `${photoId}.jpg`);
    try {
      await unlink(imagePath);
    } catch {
      // File might not exist
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}
