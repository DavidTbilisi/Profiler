# 🎯 Life Tracker - Personal Skills Portfolio

A modern, interactive web application built with Vue.js for tracking and managing your personal and professional skills journey. Monitor your current competencies, plan future learning goals, and visualize your skill development over time.

## 🌟 Features

### 📊 **Skills Management**
- **Current Skills Portfolio**: Track your existing skills with proficiency levels (1-10 scale)
- **Learning Goals**: Plan and organize skills you want to develop
- **Skill Categories**: Organize skills across 11 different categories:
  - Programming & Development 💻
  - Design & Creative 🎨  
  - Data & Analytics 📊
  - Marketing & Sales 📈
  - Communication 💬
  - Leadership & Management 👥
  - Languages 🌍
  - Technical Skills 🔧
  - Soft Skills 🤝
  - Finance & Business 💼
  - Other 🎯

### 📈 **Visual Analytics**
- **Skills Radar Chart**: Interactive visualization of your skill distribution across categories
- **Progress Tracking**: Visual progress bars and proficiency indicators
- **Points System**: Gamified skill tracking with total points and progress metrics
- **Summary Dashboard**: Overview of your skills portfolio with key statistics

### 🎯 **Goal Management**
- **Priority Levels**: Organize learning goals by High, Medium, and Low priority
- **Target Setting**: Set target proficiency levels and deadlines
- **Resource Planning**: Track learning resources (books, courses, mentors)
- **Motivation Tracking**: Record why you want to learn each skill

### 🔄 **Skill Conversion**
- **Bidirectional Conversion**: Move skills between current and aspirational categories
- **Smart Defaults**: Intelligent target setting when converting skills
- **Progress Preservation**: Maintain context and history during conversions

### 💾 **Data Management**
- **JSON Export/Import**: Backup and restore your data
- **Local Storage**: Automatic data persistence
- **Type Safety**: Full TypeScript implementation for data integrity

### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS for a clean, professional look
- **Interactive Tooltips**: Hover explanations for calculations and formulas
- **Search & Filter**: Easily find and organize your skills
- **Real-time Updates**: Instant feedback and updates across the application

## 🚀 Live Demo

Visit the live application: **[https://davidtbilisi.github.io/Profiler/](https://davidtbilisi.github.io/Profiler/)**

## 🛠️ Technical Stack

### Frontend Framework
- **Vue.js 3.5** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type safety and enhanced developer experience
- **Vue Router 4.5** - Client-side routing
- **Pinia 3.0** - State management

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Chart.js 4.5** - Interactive charts and visualizations
- **Vue-ChartJS 5.3** - Vue.js wrapper for Chart.js

### Build Tools & Development
- **Vite 7.0** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

### DevOps & Deployment
- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **Automated Testing** - ESLint, build verification
- **Dependency Updates** - Automated security and dependency management

## 📁 Project Structure

```
life-tracker/
├── src/
│   ├── components/           # Vue components
│   │   ├── Dashboard.vue     # Main dashboard view
│   │   ├── SkillsManager.vue # Skills management interface
│   │   └── SkillsRadarChart.vue # Interactive radar visualization
│   ├── constants/            # Shared constants and configurations
│   │   └── skillCategories.ts # Centralized skill categories
│   ├── stores/              # Pinia state management
│   │   └── useProfileStore.ts # Main application state
│   ├── utils/               # Utility functions
│   │   └── JsonStorage.ts   # Data persistence utilities
│   ├── views/               # Page views
│   └── router/              # Vue Router configuration
├── public/                  # Static assets
├── dist/                    # Built application (generated)
└── .github/workflows/       # CI/CD automation
```

## 🏁 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DavidTbilisi/Profiler.git
   cd Profiler/life-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the built application
npm run preview
```

## 📖 Usage Guide

### Adding Your First Skill
1. Navigate to the **Skills** page
2. Click **"+ Add Skill"** 
3. Fill in skill name, category, and proficiency level
4. Add optional description and learning goals
5. Save to add it to your portfolio

### Creating Learning Goals
1. Switch to the **"Want to Learn"** tab
2. Click **"+ Add Learning Goal"**
3. Set priority level, target proficiency, and timeline
4. Add motivation and learning resources
5. Track your progress over time

### Exporting Your Data
1. Go to **Settings** or **Dashboard**
2. Click **"Export Data"** to download JSON backup
3. Use **"Import Data"** to restore from backup

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Composition API for Vue components
- Maintain responsive design principles
- Add appropriate type definitions
- Write clear commit messages

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the excellent framework
- **Tailwind CSS** - For the utility-first CSS approach
- **Chart.js** - For powerful data visualization
- **Vite** - For blazing fast development experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/DavidTbilisi/Profiler/issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join discussions in GitHub Discussions

---

**Happy Skill Tracking! 🎯✨**

*Transform your learning journey into a visual, organized, and motivated experience.*
