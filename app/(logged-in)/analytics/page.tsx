import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import getDbConnection from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, TrendingUp, Clock } from 'lucide-react';

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const sql = await getDbConnection();
  
  const [totalPosts, monthlyPosts, recentPosts] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM posts WHERE user_id = ${user.id}`,
    sql`SELECT COUNT(*) as count FROM posts WHERE user_id = ${user.id} AND created_at >= date_trunc('month', CURRENT_DATE)`,
    sql`SELECT title, created_at, LENGTH(content) as word_count FROM posts WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 5`
  ]);

  const stats = {
    total: parseInt(totalPosts[0]?.count || '0'),
    monthly: parseInt(monthlyPosts[0]?.count || '0'),
    avgWords: Math.round(recentPosts.reduce((acc, post) => acc + (post.word_count || 0), 0) / Math.max(recentPosts.length, 1))
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Analytics</h1>
        <p className="text-gray-600">Track your content creation progress and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Posts</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">This Month</h3>
              <p className="text-3xl font-bold text-green-600">{stats.monthly}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold">Avg Words</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.avgWords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts yet. Create your first post!</p>
          ) : (
            recentPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{post.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {post.word_count || 0} chars
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.ceil((post.word_count || 0) / 1000)} min read
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Content Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Content Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Aim for 800-2000 words for optimal SEO performance</li>
          <li>• Post consistently to build audience engagement</li>
          <li>• Use clear, descriptive titles for better discoverability</li>
          <li>• Include relevant keywords naturally in your content</li>
        </ul>
      </div>
    </div>
  );
}