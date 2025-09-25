# Nuxt 4 Vibe Coding Template

A modern, production-ready Nuxt 4 template optimized for Cursor AI coding with TypeScript, Tailwind CSS, and Vitest testing.

## 🚀 Features

- **Nuxt 4** - Latest Nuxt framework with enhanced performance
- **Vue 3** - Composition API with `<script setup>` syntax
- **TypeScript** - Full type safety with strict mode
- **Tailwind CSS** - Utility-first CSS with dark mode support
- **Vitest** - Fast unit testing with coverage reports
- **Pinia** - Modern state management
- **VueUse** - Essential Vue composition utilities
- **Biome** - Ultra-fast linting and formatting (Rust-based)
- **Cursor Optimized** - Configured for AI-assisted development

## 📁 Project Structure

```
nuxt4-vibe-coding-template/
├── app/                          # Nuxt 4 app directory
│   ├── assets/                   # Static assets
│   │   └── css/                  # Global styles
│   ├── components/               # Vue components
│   ├── composables/              # Reusable composables
│   ├── layouts/                  # Layout components
│   ├── pages/                    # File-based routing
│   ├── plugins/                  # Nuxt plugins
│   ├── utils/                    # Utility functions
│   ├── app.config.ts            # App configuration
│   └── app.vue                  # Root component
├── server/                       # Server-side code
│   └── api/                     # API routes
├── test/                        # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── .cursor/                     # Cursor AI configuration
│   ├── rules/                   # Coding rules
│   └── settings.json            # Editor settings
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.js          # Tailwind configuration
├── vitest.config.ts            # Vitest configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 22+ (LTS)
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the template**
   ```bash
   git clone <your-repo-url> my-nuxt4-project
   cd my-nuxt4-project
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm generate        # Generate static site
pnpm preview         # Preview production build

# Testing
pnpm test            # Run tests in watch mode
pnpm test:ui         # Run tests with UI
pnpm test:coverage   # Run tests with coverage
pnpm test:run        # Run tests once

# Code Quality (Biome)
pnpm lint            # Run linting
pnpm lint:fix        # Fix linting issues
pnpm format          # Format code
pnpm format:check    # Check formatting
pnpm check           # Run both linting and formatting
pnpm check:fix       # Fix both linting and formatting
pnpm typecheck       # Run TypeScript type checking
```

## ⚡ Performance & Tooling

This template uses modern, high-performance tools:

### pnpm Package Manager
- **10x faster** than npm/yarn for most operations
- **Disk space efficient** with global store and hard links
- **Strict dependency resolution** prevents phantom dependencies
- **Better monorepo support** with workspace features

### Biome v2 (Replaces ESLint + Prettier)
- **10-100x faster** than ESLint + Prettier (written in Rust)
- **Zero configuration** with sensible defaults
- **Unified tooling** for linting and formatting
- **Type-aware rules** without TypeScript compiler dependency
- **Better TypeScript support** with native TS parsing
- **Fewer dependencies** and configuration files

### Installation Speed Comparison
```bash
# pnpm vs npm (typical project)
pnpm install    # ~2-3 seconds
npm install     # ~15-30 seconds

# Biome v2 vs ESLint + Prettier
biome check .   # ~100-500ms
eslint + prettier # ~2-5 seconds
```

## 🎨 Styling

This template uses **Tailwind CSS** with custom configuration:

- **Dark mode support** - Toggle with `useColorMode()`
- **Custom color palette** - Primary colors defined in config
- **Responsive design** - Mobile-first approach
- **Custom animations** - Fade, slide, and bounce effects
- **Component classes** - Pre-built button, input, and card styles

### Example Usage

```vue
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Dark Mode Example
    </h2>
    <button class="btn btn-primary">
      Primary Button
    </button>
  </div>
</template>
```

## 🧪 Testing

The template includes comprehensive testing setup:

### Unit Tests
```bash
npm run test:run
```

### Test Structure
```typescript
// test/unit/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '~/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })
})
```

### Testing Utilities
- **Vitest** - Fast test runner
- **@nuxt/test-utils** - Nuxt-specific testing utilities
- **jsdom** - DOM environment for tests
- **Coverage reports** - Built-in coverage with v8

## 🔧 Configuration

### Nuxt Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    viewTransition: true,
    typedPages: true
  },
  srcDir: 'app/',
  // ... more configuration
})
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}
```

## 🚀 Deployment

The template works with any platform that supports Node.js:

- **Netlify** - Static site generation
- **Railway** - Full-stack deployment  
- **DigitalOcean App Platform** - Container deployment
- **AWS/GCP/Azure** - Server deployment
- **Vercel** - Zero-config deployment

## 🎯 Best Practices

### Code Organization
- Use the `app/` directory structure
- Keep components small and focused
- Extract reusable logic into composables
- Follow TypeScript strict mode guidelines

### Performance
- Use lazy loading for non-critical components
- Implement proper image optimization
- Leverage Nuxt 4's enhanced caching
- Monitor Core Web Vitals

### Security
- Validate all user inputs
- Use environment variables for secrets
- Implement proper error handling
- Follow OWASP security guidelines

## 🧩 Composables

The template includes several useful composables:

### `useCounter`
```typescript
const { count, increment, decrement, reset } = useCounter(0)
```

### `useLocalStorage`
```typescript
const { value, setValue, remove } = useLocalStorage('key', defaultValue)
```

### `useApi`
```typescript
const { data, error, pending, refresh } = useApi('/api/users')
```

## 📚 Learning Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [VueUse Documentation](https://vueuse.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt Team](https://nuxt.com) for the amazing framework
- [Vue Team](https://vuejs.org) for Vue.js
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vitest](https://vitest.dev) for the fast testing framework

---

**Happy coding with Nuxt 4 and Cursor! 🚀**
