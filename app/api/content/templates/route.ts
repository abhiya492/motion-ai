import { NextRequest, NextResponse } from "next/server";
import getDbConnection from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'recommendations') {
      const recommendations = [
        {
          id: 'blog-post',
          name: 'Blog Post',
          description: 'Standard blog format with intro, body, conclusion',
          category: 'General',
          usage_count: 45
        },
        {
          id: 'tutorial',
          name: 'Tutorial Guide', 
          description: 'Step-by-step instructional content',
          category: 'Educational',
          usage_count: 32
        },
        {
          id: 'review',
          name: 'Product Review',
          description: 'Detailed review with pros and cons',
          category: 'Review',
          usage_count: 28
        }
      ];
      return NextResponse.json(recommendations);
    }
    
    const sql = await getDbConnection();
    const result = await sql`SELECT * FROM content_templates ORDER BY type, name`;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Templates fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}