# 🎥 Video to Blog AI Converter

Transform your videos into engaging blog posts instantly using the power of AI! This full-stack SaaS application leverages cutting-edge technologies to provide a seamless video-to-blog conversion experience.

## ✨ Features

### Core Functionality
- 🤖 AI-powered video transcription using OpenAI Whisper API
- ✍️ Automatic blog post generation from transcriptions
- 📝 Markdown editor for post-generation content refinement
- 🎨 Beautiful, responsive user interface

### Authentication & Security
- 🔐 Secure authentication via Clerk
  - Passkey support
  - GitHub OAuth integration
  - Google Sign-in
- 🛡️ Protected routes and API endpoints
- 🔒 Secure file handling

### Technical Features
- 📤 File uploads (up to 25MB) via UploadThing
- 💾 Serverless database with NeonDb
- 💳 Stripe integration for payments
  - Custom pricing tables
  - Subscription management
  - Payment links
  - Webhook implementation
- 🔄 Real-time updates and path revalidation

### User Experience
- 📱 Fully responsive design (mobile + desktop)
- 📊 Intuitive user dashboard
- 🔔 Toast notifications for user feedback
- 📈 SEO-optimized blog posts
- 🚀 Optimized performance

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Database**: NeonDb
- **Styling**: TailwindCSS + ShadCN UI
- **File Uploads**: UploadThing
- **Payments**: Stripe
- **AI Integration**: OpenAI API
- **Language**: TypeScript
- **Content**: React Markdown
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+ (LTS recommended)
pnpm (or npm/yarn)
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhiya492/motion-ai.git
cd motion-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# OpenAI
OPENAI_API_KEY=

# Upload Thing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

5. Run the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app running!

## 📊 Project Structure

```
└── abhiya492-motion-ai/
    ├── README.md
    ├── components.json
    ├── middleware.ts
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .eslintrc.json
    ├── actions/
    │   ├── edit-actions.ts
    │   └── upload-actions.ts
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (logged-in)/
    │   │   ├── dashboard/
    │   │   ├── posts/
    │   │   ├── sign-in/
    │   │   └── sign-up/
    │   ├── api/
    │   │   ├── payments/
    │   │   └── uploadthing/
    │   └── fonts/
    ├── components/
    │   ├── common/
    │   ├── content/
    │   ├── home/
    │   ├── ui/
    │   └── upload/
    ├── hooks/
    │   └── use-toast.ts
    ├── lib/
    │   ├── constants.ts
    │   ├── db.ts
    │   ├── payment-helpers.ts
    │   ├── user-helpers.ts
    │   └── utils.ts
    └── utils/
        └── uploadthing.ts
```

Key directories and their purposes:

- `actions/`: Server actions for handling uploads and edits
- `app/`: Next.js 14 app directory containing routes and API endpoints
- `components/`: Reusable React components organized by feature
  - `common/`: Shared components like backgrounds
  - `content/`: Content editing related components
  - `home/`: Landing page components
  - `ui/`: Basic UI components (buttons, inputs, etc.)
  - `upload/`: File upload related components
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and helpers
- `utils/`: Additional utilities and configurations

## 🧪 Features in Detail

### Video Processing
- Upload videos up to 25MB
- Automatic transcription using OpenAI Whisper
- AI-powered blog post generation
- Custom formatting options

### Blog Management
- Rich text editor for post refinement
- SEO optimization tools
- Category management
- Draft and publish workflow

### Subscription System
- Tiered pricing plans
- Usage tracking
- Payment processing
- Subscription management

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for secure authentication
- OpenAI for the powerful AI capabilities
- All other open-source contributors

---

Built with ❤️ using Next.js 14 and OpenAI
