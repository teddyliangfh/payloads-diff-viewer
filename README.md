# Payload Diff Viewer

A specialized tool for comparing JSON payloads and visualizing differences. Built with Nuxt 4, Vue 3, and TypeScript.

## 🚀 Features

- **JSON Payload Comparison** - Compare two JSON payloads and visualize differences
- **Interactive Diff Display** - Color-coded diff visualization with detailed change tracking
- **Real-time Processing** - Send payloads and get instant comparison results
- **Sample Data** - Built-in sample payloads for testing and demonstration
- **Modern UI** - Clean, responsive interface built with Tailwind CSS
- **TypeScript** - Full type safety throughout the application

## 📁 Project Structure

```
payloads-diff-viewer/
├── app/                          # Nuxt 4 app directory
│   ├── components/               # Vue components
│   │   └── DiffDisplay.vue      # Core diff visualization component
│   ├── composables/              # Reusable composables
│   │   └── usePayloads.ts       # Payload management logic
│   ├── pages/                    # File-based routing
│   │   └── index.vue            # Main payload diff interface
│   ├── layouts/                  # Layout components
│   └── app.vue                  # Root component
├── server/                       # Server-side code
│   ├── api/payloads/            # Payload-related API endpoints
│   │   ├── payload.post.ts      # Send payload endpoint
│   │   ├── comparison.get.ts    # Get comparison results
│   │   ├── status.get.ts        # Get payload status
│   │   └── clear.post.ts        # Clear payload data
│   ├── types/                   # Type definitions
│   │   └── payload.types.ts     # Payload and diff types
│   ├── utils/                   # Utility functions
│   │   └── payloadComparator.ts # Core diff comparison logic
│   └── data/                    # Sample payload data
├── test/                        # Test files
│   └── unit/                    # Unit tests
│       └── payloadComparator.test.ts # Core diff logic tests
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.js          # Tailwind configuration
├── vitest.config.ts            # Vitest configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 22+ (LTS)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url> payloads-diff-viewer
   cd payloads-diff-viewer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm preview         # Preview production build

# Testing
pnpm test            # Run tests in watch mode
pnpm test:ui         # Run tests with UI
pnpm test:coverage   # Run tests with coverage
pnpm test:run        # Run tests once

# Code Quality
pnpm lint            # Run linting
pnpm lint:fix        # Fix linting issues
pnpm typecheck       # Run TypeScript type checking
```

## 🎯 How to Use

1. **Send Payload 1** - Click the first button to send the initial payload
2. **Send Payload 2** - Click the second button to send the comparison payload
3. **View Results** - The diff visualization will show all differences between the payloads
4. **Clear Data** - Use the "Clear All" button to reset and start over

### Features

- **Automatic Comparison** - Use "Send Both (Auto)" to automatically send both payloads with a delay
- **Detailed Diff View** - See exactly what changed, was added, or removed
- **Summary Statistics** - Get an overview of total changes, additions, and removals
- **Color-coded Changes** - Green for additions, red for removals, yellow for modifications

## 🧪 Testing

The project includes comprehensive tests for the core diff comparison logic:

```bash
# Run all tests
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test
```

## 🔧 API Endpoints

The application provides several API endpoints for payload management:

- `POST /api/payloads/payload` - Send a payload for comparison
- `GET /api/payloads/comparison` - Get comparison results
- `GET /api/payloads/status` - Get current payload status
- `POST /api/payloads/clear` - Clear all payload data

## 🚀 Deployment

The application can be deployed to any platform that supports Node.js:

- **Netlify** - Static site generation
- **Railway** - Full-stack deployment  
- **DigitalOcean App Platform** - Container deployment
- **AWS/GCP/Azure** - Server deployment
- **Vercel** - Zero-config deployment

## 🎨 Styling

Built with **Tailwind CSS** for a modern, responsive design:

- **Clean Interface** - Minimal, focused design for better usability
- **Responsive Layout** - Works on desktop and mobile devices
- **Color-coded Diffs** - Intuitive color scheme for different types of changes
- **Interactive Elements** - Hover effects and smooth transitions

## 📚 Technology Stack

- **Nuxt 4** - Full-stack Vue.js framework
- **Vue 3** - Composition API with `<script setup>` syntax
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing framework
- **VueUse** - Essential Vue composition utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy payload comparing! 🚀**