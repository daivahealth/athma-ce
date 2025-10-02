# Zeal PMS - Practice Management System

A modern, responsive healthcare practice management system built with Next.js 14, TypeScript, and Tailwind CSS. Designed specifically for UAE healthcare providers with full Arabic/English support and RTL layout.

## 🚀 Features

### Core Functionality
- **Dashboard**: KPI cards, trends, quick actions
- **Patient Management**: Patient records, demographics, medical history
- **Appointment Scheduling**: Calendar view, recurring appointments, status tracking
- **Billing & Invoicing**: Invoice creation, payment tracking, financial reporting
- **Claims Management**: Insurance claims, status tracking, denial management
- **Payment Processing**: ERA/EP remittance, payment posting, reconciliation
- **Reports & Analytics**: Financial, clinical, operational, and compliance reports
- **Settings**: User management, localization, branding

### Technical Features
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark/Light Mode**: System preference detection with manual toggle
- **Internationalization**: Full Arabic/English support with RTL layout
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Optimized with React Query, lazy loading, and code splitting
- **Type Safety**: Full TypeScript implementation with strict mode

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: shadcn/ui + Lucide React icons
- **Forms**: React Hook Form + Zod validation
- **Data Tables**: TanStack Table
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Internationalization**: next-intl
- **Testing**: Playwright (E2E)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zeal/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zeal_pms"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### E2E Tests with Playwright
```bash
# Install Playwright browsers
npx playwright install

# Run tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e:headed

# Run tests for specific browser
npx playwright test --project=chromium
```

### Test Coverage
- **Navigation**: All main pages and routes
- **Theme Toggle**: Dark/light mode switching
- **Language Toggle**: English/Arabic with RTL
- **Data Tables**: Filtering, sorting, pagination, export
- **Responsive Design**: Mobile and desktop layouts
- **Accessibility**: Keyboard navigation, focus states

## 🎨 Design System

### Color Palette
- **Primary**: Indigo/Blue (`hsl(221 83% 53%)`)
- **Accent**: Teal (`hsl(174 70% 40%)`)
- **Success**: Green (`hsl(142 71% 45%)`)
- **Warning**: Orange (`hsl(38 92% 50%)`)
- **Danger**: Red (`hsl(0 84% 60%)`)

### Typography
- **Font Stack**: System fonts with Arabic fallback
- **Arabic Fonts**: Noto Sans Arabic, Tajawal, Cairo
- **Sizes**: Responsive typography scale

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

## 🌐 Internationalization

### Supported Languages
- **English (en)**: Default language
- **Arabic (ar)**: Full RTL support

### RTL Features
- **Layout**: Right-to-left text direction
- **Navigation**: Sidebar and menu items reversed
- **Tables**: Column order and alignment
- **Forms**: Input alignment and validation
- **Icons**: Directional icons flipped

### Adding New Languages
1. Create message file in `src/messages/[locale].json`
2. Add locale to `src/lib/i18n.ts`
3. Update `src/middleware.ts`
4. Add locale to `next.config.js`

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Readers**: Proper ARIA labels and roles
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: All images have descriptive alt text

### Accessibility Features
- **Skip Links**: Jump to main content
- **Focus Traps**: Modal and dropdown focus management
- **ARIA Labels**: Descriptive labels for interactive elements
- **Live Regions**: Dynamic content announcements
- **High Contrast**: Support for high contrast mode

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Mobile Features
- **Collapsible Sidebar**: Flyout navigation on mobile
- **Touch-Friendly**: 44px minimum touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Responsive Tables**: Horizontal scroll with sticky columns
- **Mobile-First**: Progressive enhancement approach

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   └── (app)/         # Main application pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── app-shell/         # Layout components
│   ├── data-table/        # Table components
│   ├── forms/             # Form components
│   └── ui/                # Base UI components
├── lib/                   # Utilities and configurations
│   ├── i18n.ts           # Internationalization config
│   ├── query.ts          # React Query setup
│   ├── rtl.ts            # RTL utilities
│   └── utils.ts          # General utilities
├── messages/              # Translation files
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
└── hooks/                 # Custom React hooks
```

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run tests with UI
npm run test:e2e:debug # Debug tests

# Code Quality
npm run format       # Format code with Prettier
npm run lint:fix     # Fix ESLint issues
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages
- **Import Order**: Organized imports with ESLint rules

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build Docker image
docker build -t zeal-pms-frontend .

# Run container
docker run -p 3000:3000 zeal-pms-frontend
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zeal_pms"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# API
NEXT_PUBLIC_API_URL="https://api.your-domain.com"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: System fonts with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: React Query with smart caching
- **Lazy Loading**: Component and route lazy loading

### Performance Metrics
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTFB**: < 600ms (Time to First Byte)

## 🔒 Security

### Security Features
- **Content Security Policy**: Strict CSP headers
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Security headers middleware
- **Environment Variables**: Sensitive data protection
- **Dependency Scanning**: Regular security audits

### Best Practices
- **Input Validation**: Zod schema validation
- **Output Encoding**: XSS prevention
- **Authentication**: Secure session management
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive data encryption
- **Audit Logging**: Security event logging

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

### Code Review Process
- **Automated Checks**: CI/CD pipeline validation
- **Code Review**: Peer review required
- **Testing**: All tests must pass
- **Documentation**: Update docs for new features
- **Accessibility**: WCAG compliance verification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Query Documentation](https://tanstack.com/query/latest)

### Community
- [GitHub Issues](https://github.com/your-org/zeal-pms/issues)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/zeal-pms)

### Professional Support
For enterprise support and custom development, contact:
- **Email**: support@zeal.healthcare
- **Phone**: +971 4 123 4567
- **Website**: https://zeal.healthcare

---

**Built with ❤️ for UAE Healthcare Providers**