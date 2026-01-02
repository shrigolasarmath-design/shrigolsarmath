export async function GET() {
  if (process.env.NODE_ENV !== 'production') {
    return new Response(JSON.stringify({ error: 'Only available in production' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('temple-photos');
    
    // List all blobs in the store
    const blobs: string[] = [];
    const listResult = await store.list();

    // Dynamically inspect the structure of listResult
    console.log('ListResult structure:', listResult);

    // Attempt to iterate over listResult.items or other properties
    if (Array.isArray(listResult)) {
      for (const blob of listResult) {
        if (blob && blob.key) {
          blobs.push(blob.key);
        }
      }
    } else {
      console.error('ListResult is not iterable:', listResult);
    }

    return new Response(JSON.stringify({ 
      count: blobs.length,
      blobs: blobs.slice(0, 50) // Return first 50 for safety
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
