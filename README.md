# Payload Diff Viewer

A **generic and extensible** tool for comparing any JSON payloads and visualizing differences. Built with Nuxt 4, Vue 3, and TypeScript.

## 🚀 Features

- **Universal JSON Comparison** - Compare any JSON structure, not just specific schemas
- **Configurable Comparison Options** - Customize comparison behavior with various strategies
- **Multiple Array Comparison Strategies** - Compare arrays by index, ID, or custom key
- **Custom Comparators** - Define custom comparison logic for specific fields
- **Interactive Diff Display** - Color-coded diff visualization with detailed change tracking
- **Real-time Processing** - Send payloads and get instant comparison results
- **Sample Data** - Built-in sample payloads for testing and demonstration
- **Modern UI** - Clean, responsive interface built with Tailwind CSS
- **TypeScript** - Full type safety throughout the application
- **Extensible Architecture** - Easy to adapt for different data structures

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
│   │   ├── payload.post.ts      # Send payload endpoint (handles comparison automatically)
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

## 🔧 Generic Comparison API

The new generic comparison system supports any JSON structure with configurable options:

### Basic Usage

```typescript
import { compareObjects } from './server/utils/payloadComparator'

// Compare any two objects
const result = compareObjects(obj1, obj2)
console.log(result.diffs) // Array of differences
console.log(result.summary) // Summary statistics
```

### Advanced Options

```typescript
const result = compareObjects(obj1, obj2, {
  arrayComparisonStrategy: 'byId', // 'byIndex' | 'byKey' | 'byId'
  ignoreKeys: ['timestamp', 'id'], // Keys to ignore
  maxDepth: 5, // Maximum comparison depth
  customComparators: {
    'price': (val1, val2) => Math.abs(val1 - val2) < 0.01 ? null : { /* diff */ }
  }
})
```

### Array Comparison Strategies

- **`byIndex`** (default): Compare arrays by position
- **`byId`**: Compare arrays by `id` field
- **`byKey`**: Compare arrays by custom key field

### Built-in Comparators

```typescript
import { CommonComparators } from './server/utils/payloadComparator'

// Date comparison
const dateComparator = CommonComparators.dateComparator('createdAt')

// Number comparison with tolerance
const numberComparator = CommonComparators.numberComparator('price', 0.01)

// Array comparison ignoring order
const arrayComparator = CommonComparators.unorderedArrayComparator('tags')
```

### Example: E-commerce Product Comparison

```typescript
const product1 = {
  id: 1,
  name: "Widget",
  price: 9.99,
  tags: ["electronics", "gadgets"],
  inventory: { stock: 100, location: "warehouse-a" }
}

const product2 = {
  id: 1,
  name: "Widget Pro",
  price: 9.98, // Slight price difference
  tags: ["gadgets", "electronics"], // Same tags, different order
  inventory: { stock: 95, location: "warehouse-b" }
}

const result = compareObjects(product1, product2, {
  arrayComparisonStrategy: 'byId',
  ignoreKeys: ['id'],
  customComparators: {
    ...CommonComparators.numberComparator('price', 0.1),
    ...CommonComparators.unorderedArrayComparator('tags')
  }
})
```

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

- `POST /api/payloads/payload` - Send a payload for comparison (automatically compares when second payload is sent)
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