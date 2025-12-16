import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  const features = [
    {
      title: "Blog Templates",
      description: "Choose from Tutorial, Review, News, or Personal blog templates",
      icon: "📚",
      items: ["Tutorial guides", "Product reviews", "News articles", "Personal stories"]
    },
    {
      title: "SEO Optimization",
      description: "AI-powered SEO suggestions with keyword recommendations",
      icon: "🔍",
      items: ["SEO titles", "Meta descriptions", "Keyword suggestions", "Heading structure"]
    },
    {
      title: "Social Media Posts",
      description: "Generate content for all major social platforms",
      icon: "📱",
      items: ["Twitter posts", "LinkedIn articles", "Facebook posts", "Instagram captions"]
    },
    {
      title: "Email Newsletters",
      description: "Transform blog content into engaging email newsletters",
      icon: "📧",
      items: ["HTML templates", "Subject lines", "Call-to-actions", "Personalization"]
    },
    {
      title: "Podcast Show Notes",
      description: "Generate comprehensive podcast show notes from transcriptions",
      icon: "🎙️",
      items: ["Episode summaries", "Timestamps", "Key topics", "Resources mentioned"]
    }
  ];

  return (
    <BgGradient>
      <div className="container mx-auto py-24 sm:py-32">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-2 text-lg font-semibold mb-6">
            Advanced Content Generation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Powerful AI Features
          </h1>
          <p className="text-lg leading-8 text-gray-700 max-w-3xl mx-auto">
            Transform your video content into multiple formats with our advanced AI-powered content generation tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-700 mb-6">
              Upload your first video and experience the power of AI-driven content generation.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Start Creating Content
            </a>
          </div>
        </div>
      </div>
    </BgGradient>
  );
}