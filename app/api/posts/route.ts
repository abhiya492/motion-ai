import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import getDbConnection from '@/lib/db';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = await getDbConnection();
    const posts = await sql`
      SELECT 
        id, 
        title, 
        content, 
        created_at, 
        updated_at,
        'published' as status,
        'en' as language,
        'blog' as template,
        LENGTH(content) as word_count
      FROM posts 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC
    `;

    console.log('Posts found:', posts.length, 'for user:', user.id);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}