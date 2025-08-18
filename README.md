# 📚 Bookmark Manager

![banner](/public/og-image.png)

A sleek and modern public client for Linkding, built with Next.js 15, React 19, and Tailwind CSS. It lets you explore all your stored bookmarks with a beautiful UI, seamless Linkding API integration, and full dark/light theme support.

![Bookmark Manager](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: System-aware theme switching with smooth transitions
- **Beautiful Components**: Built with Radix UI primitives and shadcn/ui
- **Smooth Animations**: CSS transitions and micro-interactions

### 🔍 **Advanced Search & Filtering**
- **Real-time Search**: Instant bookmark search with debounced input
- **Smart Filters**: Filter by archived, unread, shared status
- **Flexible Sorting**: Sort by date (newest/oldest) or title (A-Z/Z-A)
- **Tag Management**: Interactive tag panel with visual tag counts

### 🚀 **Performance Optimized**
- **Infinite Scrolling**: Seamless loading of bookmark collections
- **Blazing Fast API**: In-memory caching with 95% faster cached responses
- **Parallel Requests**: Optimized data fetching strategies
- **Loading States**: Beautiful skeleton components during data loads

### 📱 **Mobile-First Design**
- **Touch Optimized**: Perfect touch targets and mobile gestures
- **Responsive Navbar**: Adaptive two-row mobile layout
- **Icon-Only Mobile**: Compact mobile interface with smart visual indicators
- **Scroll-to-Top**: Convenient navigation for long lists

## 🛠️ Tech Stack

### **Core Framework**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### **Styling & UI**
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Consistent icon library
- **Tweakcn** - Theme management system

### **Performance & DX**
- **Turbopack** - Ultra-fast bundler for development
- **Geist Font** - Modern font stack (Sans & Mono)
- **ESLint** - Code quality and consistency
- **Vercel Speed Insights** - Performance monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- A running Linkding instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bookmark-manager.git
   cd bookmark-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Linkding API Configuration
   LINKDING_API_URL=http://your-linkding-instance.com
   LINKDING_API_TOKEN=your-api-token
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🔧 Configuration

### Theme Configuration
Customize themes in `globals.css` using [tweakcn](https://tweakcn.com/editor/theme).

## 🧪 Development

### **Available Scripts**

```bash
# Development with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type checking
npx tsc --noEmit
```

### **Development Features**
- **Hot reload**: Instant updates during development
- **Error overlay**: Detailed error information
- **TypeScript**: Full type checking and IntelliSense

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Environment Variables**
Required for production:
```env
LINKDING_API_URL=https://your-linkding-instance.com
LINKDING_API_TOKEN=your-production-token
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use Prettier for formatting
- Follow component naming conventions
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [tweakcn](https://tweakcn.com/) - Theme management system
- [Linkding](https://github.com/sissbruecker/linkding) - Bookmark service
- [Vercel](https://vercel.com/) - Deployment platform
