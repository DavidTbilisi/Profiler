# Life Tracker CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline using GitHub Actions that automatically builds, tests, and deploys the application.

## 🚀 Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)
- **Triggers**: Push to `main`/`develop`, PRs to `main`
- **Jobs**:
  - 🧪 **Test & Lint**: ESLint, TypeScript checking, unit tests
  - 🏗️ **Build**: Application build with artifact upload
  - 🔒 **Security**: NPM audit for vulnerabilities
  - 🚀 **Deploy**: Automatic deployment to GitHub Pages (main branch only)
  - 📢 **Notify**: Pipeline status reporting

### 2. Dependency Updates (`dependency-updates.yml`)
- **Triggers**: Weekly schedule (Mondays 9 AM UTC), manual dispatch
- **Function**: Automatically updates dependencies and creates PRs

### 3. Code Quality (`code-quality.yml`)
- **Triggers**: Push to `main`/`develop`, PRs to `main`
- **Function**: Comprehensive code quality analysis including:
  - ESLint detailed reporting
  - TypeScript strict checking
  - Bundle size analysis
  - Accessibility audits

### 4. Performance Monitoring (`performance.yml`)
- **Triggers**: Push to `main`, PRs to `main`
- **Function**: Lighthouse performance audits with:
  - Performance scoring
  - Accessibility checks
  - Best practices validation
  - SEO analysis

### 5. Release (`release.yml`)
- **Triggers**: Git tags (`v*`)
- **Function**: Creates GitHub releases and deploys tagged versions

## 📊 Monitoring

The pipeline includes comprehensive monitoring:
- **Performance**: Lighthouse CI integration
- **Security**: Automated dependency audits
- **Quality**: ESLint and TypeScript checking
- **Accessibility**: Built-in accessibility testing

## 🛠️ Development

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch. 

**Deployment URL**: `https://DavidTbilisi.github.io/Profiler/`

### Project Structure
```
Profiler/                    # Repository root
├── .github/workflows/       # CI/CD workflows
├── life-tracker/           # Vue.js application
│   ├── src/                # Application source code
│   ├── dist/               # Build output (deployed to GitHub Pages)
│   └── package.json        # Node.js dependencies
└── CI-CD-README.md         # This documentation
```

### Local Development
```bash
cd life-tracker
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

The build process creates optimized files in `life-tracker/dist/` which are automatically deployed to GitHub Pages.

## 🔧 Configuration

- **Vite Config**: Configured for GitHub Pages deployment with proper base path
- **Lighthouse**: Custom configuration in `.github/lighthouse/lighthouse.json`
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency rules

## 📝 Notes

- All workflows use npm (not pnpm) for consistency
- The application is built from the `life-tracker` subdirectory
- GitHub Pages deployment includes proper base path configuration
- Dependency updates are automated but require manual review/merge
