import { getStore } from '@netlify/blobs';

interface ContentData {
  heroPhotos?: any[];
  sectionBackgrounds?: any;
  pageBackgrounds?: any;
  bannerSettings?: any;
  books?: any[];
  songs?: any[];
  contactInfo?: any;
  templeHistory?: any;
  about?: any;
  timings?: any;
  timingsSection?: any;
  sevaSection?: any;
  templeBoxes?: any;
}

export async function GET() {
  try {
    const store = getStore('temple-content');
    const content = await store.get('content', { type: 'json' }) as ContentData | null;
    
    // Return empty object if no content exists yet
    return Response.json(content || {});
  } catch (error) {
    console.error('Error reading content:', error);
    return Response.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const store = getStore('temple-content');
    
    // Read existing content
    let existingContent = await store.get('content', { type: 'json' }) as ContentData | null;
    if (!existingContent) {
      existingContent = {};
    }
    
    // Merge updates with existing content
    const newContent = { ...existingContent, ...updates };
    
    // Write back to blob storage
    await store.setJSON('content', newContent);
    
    return Response.json({ success: true, content: newContent });
  } catch (error) {
    console.error('Error saving content:', error);
    return Response.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

