import { ref } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

export interface SkillPoolItem {
  id?: string
  name: string
  category: string
  proficiency?: number
  description?: string
}

export interface SkillDependency {
  fromSkillId: string
  toSkillId: string
  requiredProficiency?: number
  description?: string
}

export interface SkillPoolSource {
  name: string
  icon: string
  description: string
  skills: SkillPoolItem[]
  dependencies?: SkillDependency[]
}

export const useSkillPool = () => {
  const store = useProfileStore()
  const isLoading = ref(false)

  // Skill Pool Sources
  const linkedInSkills: SkillPoolItem[] = [
    // Tech Skills
    { name: 'Machine Learning', category: 'Artificial Intelligence', proficiency: 0, description: 'Building intelligent systems that learn from data' },
    { name: 'Data Science', category: 'Data Analysis', proficiency: 0, description: 'Extracting insights from large datasets' },
    { name: 'Cloud Computing', category: 'Infrastructure', proficiency: 0, description: 'AWS, Azure, Google Cloud platforms' },
    { name: 'DevOps', category: 'Operations', proficiency: 0, description: 'Continuous integration and deployment practices' },
    { name: 'Artificial Intelligence', category: 'AI/ML', proficiency: 0, description: 'Creating intelligent automation systems' },
    { name: 'Cybersecurity', category: 'Security', proficiency: 0, description: 'Protecting systems and data from threats' },
    { name: 'Mobile Development', category: 'Mobile', proficiency: 0, description: 'iOS and Android app development' },
    { name: 'UI/UX Design', category: 'Design', proficiency: 0, description: 'User interface and experience design' },
    
    // Soft Skills
    { name: 'Leadership', category: 'Management', proficiency: 0, description: 'Leading teams and driving results' },
    { name: 'Project Management', category: 'Management', proficiency: 0, description: 'Planning and executing projects successfully' },
    { name: 'Communication', category: 'Soft Skills', proficiency: 0, description: 'Effective verbal and written communication' },
    { name: 'Problem Solving', category: 'Soft Skills', proficiency: 0, description: 'Analytical thinking and solution finding' },
    { name: 'Teamwork', category: 'Soft Skills', proficiency: 0, description: 'Collaborating effectively with others' },
    { name: 'Adaptability', category: 'Soft Skills', proficiency: 0, description: 'Flexibility in changing environments' }
  ]

  const gitHubTrendingSkills: SkillPoolItem[] = [
    // Programming Languages
    { name: 'Rust', category: 'Programming', proficiency: 0, description: 'Systems programming language focused on safety' },
    { name: 'Go', category: 'Programming', proficiency: 0, description: 'Fast, statically typed language by Google' },
    { name: 'Kotlin', category: 'Programming', proficiency: 0, description: 'Modern alternative to Java for Android' },
    { name: 'Swift', category: 'Programming', proficiency: 0, description: 'Apple\'s programming language for iOS/macOS' },
    { name: 'TypeScript', category: 'Programming', proficiency: 0, description: 'Typed superset of JavaScript' },
    
    // Frameworks & Libraries
    { name: 'Next.js', category: 'Web Development', proficiency: 0, description: 'React framework for production' },
    { name: 'Svelte', category: 'Web Development', proficiency: 0, description: 'Compile-time web framework' },
    { name: 'Tailwind CSS', category: 'Web Development', proficiency: 0, description: 'Utility-first CSS framework' },
    { name: 'FastAPI', category: 'Backend Development', proficiency: 0, description: 'Modern Python web framework' },
    { name: 'Deno', category: 'Backend Development', proficiency: 0, description: 'Secure runtime for JavaScript/TypeScript' },
    
    // Tools & Technologies
    { name: 'Docker', category: 'DevOps', proficiency: 0, description: 'Containerization platform' },
    { name: 'Kubernetes', category: 'DevOps', proficiency: 0, description: 'Container orchestration system' },
    { name: 'GraphQL', category: 'API Development', proficiency: 0, description: 'Query language for APIs' },
    { name: 'Web3', category: 'Blockchain', proficiency: 0, description: 'Decentralized web technologies' },
    { name: 'TensorFlow', category: 'Machine Learning', proficiency: 0, description: 'Open source ML framework' }
  ]

  const jobMarketSkills: SkillPoolItem[] = [
    // High-Demand Tech Skills
    { name: 'AWS', category: 'Cloud Computing', proficiency: 0, description: 'Amazon Web Services cloud platform' },
    { name: 'React', category: 'Web Development', proficiency: 0, description: 'JavaScript library for building UIs' },
    { name: 'Python', category: 'Programming', proficiency: 0, description: 'Versatile programming language' },
    { name: 'SQL', category: 'Database', proficiency: 0, description: 'Database query language' },
    { name: 'Java', category: 'Programming', proficiency: 0, description: 'Enterprise programming language' },
    { name: 'Node.js', category: 'Backend Development', proficiency: 0, description: 'JavaScript runtime environment' },
    { name: 'Salesforce', category: 'CRM', proficiency: 0, description: 'Customer relationship management platform' },
    { name: 'Tableau', category: 'Data Visualization', proficiency: 0, description: 'Business intelligence and analytics' },
    { name: 'Power BI', category: 'Data Visualization', proficiency: 0, description: 'Microsoft business analytics tool' },
    { name: 'Agile', category: 'Methodology', proficiency: 0, description: 'Iterative project management approach' },
    { name: 'Scrum', category: 'Methodology', proficiency: 0, description: 'Agile framework for product development' },
    { name: 'JIRA', category: 'Tools', proficiency: 0, description: 'Issue tracking and project management' },
    { name: 'Git', category: 'Version Control', proficiency: 0, description: 'Distributed version control system' },
    { name: 'Jenkins', category: 'CI/CD', proficiency: 0, description: 'Automation server for CI/CD pipelines' },
    { name: 'Microservices', category: 'Architecture', proficiency: 0, description: 'Distributed system architecture pattern' }
  ]

  // Demo Data Sets with Different Skill Counts
  const demoData10Skills: SkillPoolItem[] = [
    { name: 'HTML', category: 'Web Development', proficiency: 8, description: 'Basic HTML markup language' },
    { name: 'CSS', category: 'Web Development', proficiency: 7, description: 'Styling web pages' },
    { name: 'JavaScript', category: 'Programming', proficiency: 6, description: 'Client-side scripting' },
    { name: 'Git', category: 'Tools', proficiency: 5, description: 'Version control system' },
    { name: 'React', category: 'Web Development', proficiency: 4, description: 'JavaScript UI library' },
    { name: 'Node.js', category: 'Backend Development', proficiency: 3, description: 'JavaScript runtime' },
    { name: 'Python', category: 'Programming', proficiency: 7, description: 'Versatile programming language' },
    { name: 'SQL', category: 'Database', proficiency: 6, description: 'Database query language' },
    { name: 'Docker', category: 'DevOps', proficiency: 2, description: 'Containerization platform' },
    { name: 'Linux', category: 'Systems', proficiency: 5, description: 'Unix-like operating system' }
  ]

  const demoDeps10Skills: SkillDependency[] = [
    { fromSkillId: 'html', toSkillId: 'css', requiredProficiency: 6, description: 'HTML basics needed for CSS styling' },
    { fromSkillId: 'css', toSkillId: 'javascript', requiredProficiency: 5, description: 'Styling knowledge helps with DOM manipulation' },
    { fromSkillId: 'javascript', toSkillId: 'react', requiredProficiency: 6, description: 'JavaScript fundamentals required for React' },
    { fromSkillId: 'javascript', toSkillId: 'nodejs', requiredProficiency: 5, description: 'JavaScript knowledge for server-side development' },
    { fromSkillId: 'linux', toSkillId: 'git', requiredProficiency: 3, description: 'Command line familiarity helps with Git' },
    { fromSkillId: 'python', toSkillId: 'sql', requiredProficiency: 4, description: 'Programming background helps with database queries' }
  ]

  const demoData20Skills: SkillPoolItem[] = [
    ...demoData10Skills,
    { name: 'TypeScript', category: 'Programming', proficiency: 5, description: 'Typed JavaScript superset' },
    { name: 'Vue.js', category: 'Web Development', proficiency: 6, description: 'Progressive JavaScript framework' },
    { name: 'MongoDB', category: 'Database', proficiency: 4, description: 'NoSQL document database' },
    { name: 'Express.js', category: 'Backend Development', proficiency: 5, description: 'Node.js web framework' },
    { name: 'AWS', category: 'Cloud Computing', proficiency: 3, description: 'Amazon Web Services' },
    { name: 'REST APIs', category: 'API Development', proficiency: 6, description: 'RESTful service design' },
    { name: 'Responsive Design', category: 'Web Development', proficiency: 7, description: 'Mobile-friendly layouts' },
    { name: 'Webpack', category: 'Build Tools', proficiency: 4, description: 'Module bundler' },
    { name: 'Jest', category: 'Testing', proficiency: 5, description: 'JavaScript testing framework' },
    { name: 'Sass/SCSS', category: 'Web Development', proficiency: 6, description: 'CSS preprocessor' }
  ]

  const demoDeps20Skills: SkillDependency[] = [
    ...demoDeps10Skills,
    { fromSkillId: 'javascript', toSkillId: 'typescript', requiredProficiency: 7, description: 'Strong JavaScript foundation for TypeScript' },
    { fromSkillId: 'html', toSkillId: 'vuejs', requiredProficiency: 6, description: 'HTML knowledge for Vue templates' },
    { fromSkillId: 'javascript', toSkillId: 'vuejs', requiredProficiency: 6, description: 'JavaScript required for Vue.js' },
    { fromSkillId: 'nodejs', toSkillId: 'expressjs', requiredProficiency: 4, description: 'Node.js foundation for Express framework' },
    { fromSkillId: 'nodejs', toSkillId: 'mongodb', requiredProficiency: 3, description: 'Backend knowledge helpful for database integration' },
    { fromSkillId: 'javascript', toSkillId: 'rest-apis', requiredProficiency: 5, description: 'JavaScript knowledge for API consumption' },
    { fromSkillId: 'css', toSkillId: 'responsive-design', requiredProficiency: 6, description: 'CSS fundamentals for responsive layouts' },
    { fromSkillId: 'css', toSkillId: 'sassscss', requiredProficiency: 7, description: 'CSS knowledge required for preprocessors' },
    { fromSkillId: 'javascript', toSkillId: 'webpack', requiredProficiency: 5, description: 'JavaScript understanding for build tools' },
    { fromSkillId: 'javascript', toSkillId: 'jest', requiredProficiency: 6, description: 'JavaScript skills needed for testing frameworks' }
  ]

  const demoData30Skills: SkillPoolItem[] = [
    ...demoData20Skills,
    { name: 'Angular', category: 'Web Development', proficiency: 4, description: 'TypeScript web framework' },
    { name: 'GraphQL', category: 'API Development', proficiency: 3, description: 'Query language for APIs' },
    { name: 'Redis', category: 'Database', proficiency: 4, description: 'In-memory data store' },
    { name: 'Kubernetes', category: 'DevOps', proficiency: 2, description: 'Container orchestration' },
    { name: 'Jenkins', category: 'CI/CD', proficiency: 3, description: 'Automation server' },
    { name: 'Nginx', category: 'Web Server', proficiency: 4, description: 'Web server and reverse proxy' },
    { name: 'PostgreSQL', category: 'Database', proficiency: 5, description: 'Advanced relational database' },
    { name: 'Elasticsearch', category: 'Search', proficiency: 3, description: 'Search and analytics engine' },
    { name: 'Terraform', category: 'Infrastructure', proficiency: 2, description: 'Infrastructure as code' },
    { name: 'Microservices', category: 'Architecture', proficiency: 4, description: 'Distributed system design' }
  ]

  const demoDeps30Skills: SkillDependency[] = [
    ...demoDeps20Skills,
    { fromSkillId: 'typescript', toSkillId: 'angular', requiredProficiency: 6, description: 'TypeScript is primary language for Angular' },
    { fromSkillId: 'rest-apis', toSkillId: 'graphql', requiredProficiency: 5, description: 'API design knowledge helpful for GraphQL' },
    { fromSkillId: 'mongodb', toSkillId: 'redis', requiredProficiency: 4, description: 'Database concepts help with caching strategies' },
    { fromSkillId: 'docker', toSkillId: 'kubernetes', requiredProficiency: 6, description: 'Docker containerization required for Kubernetes' },
    { fromSkillId: 'git', toSkillId: 'jenkins', requiredProficiency: 4, description: 'Version control knowledge for CI/CD pipelines' },
    { fromSkillId: 'linux', toSkillId: 'nginx', requiredProficiency: 5, description: 'Linux system knowledge for web server configuration' },
    { fromSkillId: 'sql', toSkillId: 'postgresql', requiredProficiency: 6, description: 'SQL fundamentals for advanced PostgreSQL features' },
    { fromSkillId: 'mongodb', toSkillId: 'elasticsearch', requiredProficiency: 4, description: 'NoSQL concepts helpful for search engines' },
    { fromSkillId: 'aws', toSkillId: 'terraform', requiredProficiency: 4, description: 'Cloud platform knowledge for infrastructure as code' },
    { fromSkillId: 'rest-apis', toSkillId: 'microservices', requiredProficiency: 6, description: 'API design principles essential for microservices' }
  ]

  const demoData35Skills: SkillPoolItem[] = [
    ...demoData30Skills,
    { name: 'Go', category: 'Programming', proficiency: 3, description: 'Google\'s systems language' },
    { name: 'Rust', category: 'Programming', proficiency: 2, description: 'Memory-safe systems language' },
    { name: 'Next.js', category: 'Web Development', proficiency: 5, description: 'React production framework' },
    { name: 'Tailwind CSS', category: 'Web Development', proficiency: 6, description: 'Utility-first CSS framework' },
    { name: 'Firebase', category: 'Backend as a Service', proficiency: 4, description: 'Google\'s app development platform' }
  ]

  const demoDeps35Skills: SkillDependency[] = [
    ...demoDeps30Skills,
    { fromSkillId: 'python', toSkillId: 'go', requiredProficiency: 6, description: 'Programming fundamentals help with learning Go' },
    { fromSkillId: 'python', toSkillId: 'rust', requiredProficiency: 7, description: 'Strong programming background needed for Rust' },
    { fromSkillId: 'react', toSkillId: 'nextjs', requiredProficiency: 6, description: 'React mastery required for Next.js framework' },
    { fromSkillId: 'css', toSkillId: 'tailwind-css', requiredProficiency: 6, description: 'CSS understanding helpful for utility-first approach' },
    { fromSkillId: 'nodejs', toSkillId: 'firebase', requiredProficiency: 4, description: 'Backend concepts helpful for Firebase integration' }
  ]

  const demoData40Skills: SkillPoolItem[] = [
    ...demoData35Skills,
    { name: 'Svelte', category: 'Web Development', proficiency: 3, description: 'Compile-time web framework' },
    { name: 'WebAssembly', category: 'Web Technology', proficiency: 2, description: 'High-performance web execution' },
    { name: 'Three.js', category: 'Graphics', proficiency: 3, description: '3D graphics library' },
    { name: 'Socket.io', category: 'Real-time', proficiency: 4, description: 'Real-time communication' },
    { name: 'Blockchain', category: 'Emerging Tech', proficiency: 2, description: 'Distributed ledger technology' }
  ]

  const demoDeps40Skills: SkillDependency[] = [
    ...demoDeps35Skills,
    { fromSkillId: 'javascript', toSkillId: 'svelte', requiredProficiency: 6, description: 'JavaScript knowledge for Svelte framework' },
    { fromSkillId: 'rust', toSkillId: 'webassembly', requiredProficiency: 5, description: 'Rust can compile to WebAssembly' },
    { fromSkillId: 'javascript', toSkillId: 'threejs', requiredProficiency: 7, description: 'Advanced JavaScript for 3D graphics programming' },
    { fromSkillId: 'nodejs', toSkillId: 'socketio', requiredProficiency: 5, description: 'Node.js backend for real-time communication' },
    { fromSkillId: 'python', toSkillId: 'blockchain', requiredProficiency: 6, description: 'Programming foundation for blockchain development' }
  ]

  const demoData45Skills: SkillPoolItem[] = [
    ...demoData40Skills,
    { name: 'Machine Learning', category: 'AI/ML', proficiency: 3, description: 'Intelligent systems development' },
    { name: 'TensorFlow', category: 'AI/ML', proficiency: 2, description: 'ML framework by Google' },
    { name: 'Cybersecurity', category: 'Security', proficiency: 4, description: 'Information security practices' },
    { name: 'DevSecOps', category: 'Security', proficiency: 3, description: 'Security in DevOps practices' },
    { name: 'AR/VR', category: 'Emerging Tech', proficiency: 2, description: 'Augmented and Virtual Reality' }
  ]

  const demoDeps45Skills: SkillDependency[] = [
    ...demoDeps40Skills,
    { fromSkillId: 'python', toSkillId: 'machine-learning', requiredProficiency: 7, description: 'Python is primary language for ML development' },
    { fromSkillId: 'machine-learning', toSkillId: 'tensorflow', requiredProficiency: 5, description: 'ML concepts required for TensorFlow framework' },
    { fromSkillId: 'linux', toSkillId: 'cybersecurity', requiredProficiency: 6, description: 'System knowledge essential for security practices' },
    { fromSkillId: 'jenkins', toSkillId: 'devsecops', requiredProficiency: 5, description: 'CI/CD knowledge for security integration' },
    { fromSkillId: 'threejs', toSkillId: 'arvr', requiredProficiency: 6, description: '3D graphics foundation for immersive experiences' }
  ]

  // Available skill pool sources
  const skillPoolSources: SkillPoolSource[] = [
    {
      name: 'LinkedIn Skills',
      icon: '💼',
      description: 'Popular professional skills from LinkedIn\'s database',
      skills: linkedInSkills
    },
    {
      name: 'GitHub Trending',
      icon: '🐙',
      description: 'Trending technologies from GitHub',
      skills: gitHubTrendingSkills
    },
    {
      name: 'Job Market Skills',
      icon: '📈',
      description: 'In-demand skills from current job market',
      skills: jobMarketSkills
    }
  ]

  // Demo Data Sources
  const demoDataSources = [
    {
      name: '10 Skills - Starter',
      icon: '🟢',
      description: 'Essential web development skills for beginners',
      skills: demoData10Skills,
      dependencies: demoDeps10Skills,
      count: 10
    },
    {
      name: '20 Skills - Intermediate',
      icon: '🟡',
      description: 'Expanded skillset with modern frameworks',
      skills: demoData20Skills,
      dependencies: demoDeps20Skills,
      count: 20
    },
    {
      name: '30 Skills - Advanced',
      icon: '🟠',
      description: 'Professional developer with backend expertise',
      skills: demoData30Skills,
      dependencies: demoDeps30Skills,
      count: 30
    },
    {
      name: '35 Skills - Senior',
      icon: '🔴',
      description: 'Senior developer with emerging technologies',
      skills: demoData35Skills,
      dependencies: demoDeps35Skills,
      count: 35
    },
    {
      name: '40 Skills - Expert',
      icon: '🟣',
      description: 'Expert-level with cutting-edge technologies',
      skills: demoData40Skills,
      dependencies: demoDeps40Skills,
      count: 40
    },
    {
      name: '45 Skills - Master',
      icon: '⚫',
      description: 'Master-level with AI/ML and security expertise',
      skills: demoData45Skills,
      dependencies: demoDeps45Skills,
      count: 45
    }
  ]

  // Core Functions
  const createNewSkill = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const name = prompt('Enter skill name:')
      if (!name) {
        resolve(false)
        return
      }
      
      const category = prompt('Enter skill category (e.g., Programming, Web Development, Tools):') || 'Other'
      const proficiencyStr = prompt('Enter current proficiency (0-10):') || '0'
      const proficiency = parseInt(proficiencyStr)
      const description = prompt('Enter skill description (optional):') || ''
      
      if (isNaN(proficiency) || proficiency < 0 || proficiency > 10) {
        alert('Proficiency must be a number between 0 and 10')
        resolve(false)
        return
      }
      
      // Check if skill already exists
      const skillId = name.toLowerCase().replace(/\s+/g, '-')
      if (store.skills.some(s => s.id === skillId) ||
          store.aspirationalSkills.some(s => s.id === skillId)) {
        alert('A skill with this name already exists')
        resolve(false)
        return
      }
      
      const now = new Date().toISOString()
      const newSkill = {
        id: skillId,
        name,
        category,
        proficiency,
        description,
        createdAt: now,
        updatedAt: now
      }
      
      store.skills.push(newSkill)
      store.saveToLocalStorage()
      
      alert(`✅ Successfully created skill: ${name}`)
      resolve(true)
    })
  }

  const addSkillsFromPool = (skillsPool: SkillPoolItem[], source: string): Promise<number> => {
    return new Promise((resolve) => {
      const skillChoices = skillsPool.map((skill, index) => 
        `${index + 1}. ${skill.name} (${skill.category})`
      ).join('\n')
      
      const choice = prompt(
        `${source} - Select skills to add (comma-separated numbers, or 'all' for all skills):\n\n${skillChoices}\n\nEnter your choice:`
      )
      
      if (!choice) {
        resolve(0)
        return
      }
      
      let selectedSkills: SkillPoolItem[] = []
      
      if (choice.toLowerCase() === 'all') {
        selectedSkills = skillsPool
      } else {
        const indices = choice.split(',').map(n => parseInt(n.trim()) - 1)
        selectedSkills = indices
          .filter(i => i >= 0 && i < skillsPool.length)
          .map(i => skillsPool[i])
      }
      
      if (selectedSkills.length === 0) {
        alert('No valid skills selected')
        resolve(0)
        return
      }
      
      // Add skills using the shared function
      const addedCount = addSkillsToStore(selectedSkills, source)
      
      if (addedCount > 0) {
        alert(`✅ Successfully added ${addedCount} skills from ${source}`)
      } else {
        alert('No new skills were added (all selected skills already exist)')
      }
      
      resolve(addedCount)
    })
  }

  // File Import Functions
  const importFromFile = (): Promise<number> => {
    return new Promise((resolve) => {
      try {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json,.csv,.xlsx,.xls'
        
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0]
          if (!file) {
            resolve(0)
            return
          }
          
          const extension = file.name.split('.').pop()?.toLowerCase()
          
          try {
            isLoading.value = true
            let importedCount = 0
            
            if (extension === 'json') {
              importedCount = await importFromJSON(file)
            } else if (extension === 'csv') {
              importedCount = await importFromCSV(file)
            } else {
              alert('Supported formats: JSON, CSV. Excel support coming soon!')
              resolve(0)
              return
            }
            
            resolve(importedCount)
          } catch (error) {
            console.error('Import error:', error)
            alert('Error importing file. Please check the format and try again.')
            resolve(0)
          } finally {
            isLoading.value = false
          }
        }
        
        input.click()
      } catch (error) {
        console.error('File import error:', error)
        alert('Error opening file dialog')
        resolve(0)
      }
    })
  }

  const importFromJSON = async (file: File): Promise<number> => {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (!Array.isArray(data)) {
      alert('JSON file must contain an array of skills')
      return 0
    }
    
    const skills = data.map((item, index) => ({
      id: (item.id || item.name || `imported-${index}`).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: item.name || `Imported Skill ${index + 1}`,
      category: item.category || 'Imported',
      proficiency: Math.min(Math.max(parseInt(item.proficiency) || 0, 0), 10),
      description: item.description || ''
    }))
    
    return addSkillsToStore(skills, 'JSON Import')
  }

  const importFromCSV = async (file: File): Promise<number> => {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      alert('CSV file must have at least a header row and one data row')
      return 0
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const nameIndex = headers.findIndex(h => h.includes('name'))
    const categoryIndex = headers.findIndex(h => h.includes('category'))
    const proficiencyIndex = headers.findIndex(h => h.includes('proficiency') || h.includes('level'))
    const descriptionIndex = headers.findIndex(h => h.includes('description'))
    
    if (nameIndex === -1) {
      alert('CSV file must have a "name" column')
      return 0
    }
    
    const skills = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      
      return {
        id: (values[nameIndex] || `imported-${index}`).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: values[nameIndex] || `Imported Skill ${index + 1}`,
        category: values[categoryIndex] || 'Imported',
        proficiency: Math.min(Math.max(parseInt(values[proficiencyIndex]) || 0, 0), 10),
        description: values[descriptionIndex] || ''
      }
    })
    
    return addSkillsToStore(skills, 'CSV Import')
  }

  // Fetch from predefined sources
  const fetchFromLinkedIn = () => addSkillsFromPool(linkedInSkills, 'LinkedIn Skills')
  const fetchFromGitHub = () => addSkillsFromPool(gitHubTrendingSkills, 'GitHub Trending')
  const fetchFromJobMarket = () => addSkillsFromPool(jobMarketSkills, 'Job Market Skills')

  // Demo Data Loading Functions
  const loadDemoData = (skillCount: number): Promise<number> => {
    const demoSource = demoDataSources.find(source => source.count === skillCount)
    if (!demoSource) {
      return Promise.resolve(0)
    }
    
    return new Promise((resolve) => {
      // Add skills first
      const addedSkills = addSkillsToStore(demoSource.skills, demoSource.name)
      
      // Add dependencies if they exist
      if (demoSource.dependencies && demoSource.dependencies.length > 0) {
        console.log(`🔗 Adding ${demoSource.dependencies.length} skill dependencies for ${demoSource.name}`)
        demoSource.dependencies.forEach(dep => {
          console.log(`📎 Adding dependency: ${dep.fromSkillId} → ${dep.toSkillId} (${dep.description})`)
          store.addSkillDependency(
            dep.fromSkillId,
            dep.toSkillId,
            dep.requiredProficiency,
            dep.description
          )
        })
        console.log(`✅ Successfully added ${demoSource.dependencies.length} skill dependencies`)
      }
      
      resolve(addedSkills)
    })
  }

  const addSkillsToStore = (skills: SkillPoolItem[], sourceName: string): number => {
    const now = new Date().toISOString()
    let addedCount = 0
    
    console.log(`🎯 Adding ${skills.length} skills to store from ${sourceName}`)
    
    skills.forEach(skill => {
      const skillId = skill.id || skill.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      console.log(`📝 Processing skill: "${skill.name}" → ID: "${skillId}"`)
      
      // Check if skill already exists
      if (!store.skills.some(s => s.id === skillId) && 
          !store.aspirationalSkills.some(s => s.id === skillId)) {
        
        const newSkill = {
          id: skillId,
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency || 0,
          description: skill.description || '',
          createdAt: now,
          updatedAt: now
        }
        
        if ((skill.proficiency || 0) > 0) {
          store.skills.push(newSkill)
          console.log(`✅ Added regular skill: ${skill.name} (proficiency: ${skill.proficiency})`)
        } else {
          // Add as aspirational skill if no proficiency
          store.aspirationalSkills.push({
            ...newSkill,
            priority: 'Medium' as const,
            reason: `Added from ${sourceName}`
          })
          console.log(`⭐ Added aspirational skill: ${skill.name}`)
        }
        addedCount++
      } else {
        console.log(`⚠️ Skill already exists: ${skill.name} (${skillId})`)
      }
    })
    
    store.saveToLocalStorage()
    console.log(`🎉 Successfully added ${addedCount} skills to store`)
    return addedCount
  }

  const loadDemo10Skills = () => loadDemoData(10)
  const loadDemo20Skills = () => loadDemoData(20)
  const loadDemo30Skills = () => loadDemoData(30)
  const loadDemo35Skills = () => loadDemoData(35)
  const loadDemo40Skills = () => loadDemoData(40)
  const loadDemo45Skills = () => loadDemoData(45)

  const clearAllSkills = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmClear = confirm('Are you sure you want to clear all skills? This action cannot be undone.')
      if (confirmClear) {
        store.skills = []
        store.aspirationalSkills = []
        store.skillDependencies = []
        store.saveToLocalStorage()
        alert('✅ All skills cleared successfully')
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  return {
    // State
    isLoading,
    skillPoolSources,
    demoDataSources,
    
    // Functions
    createNewSkill,
    addSkillsFromPool,
    importFromFile,
    fetchFromLinkedIn,
    fetchFromGitHub,
    fetchFromJobMarket,
    
    // Demo Data Functions
    loadDemoData,
    loadDemo10Skills,
    loadDemo20Skills,
    loadDemo30Skills,
    loadDemo35Skills,
    loadDemo40Skills,
    loadDemo45Skills,
    clearAllSkills,
    
    // Export formats for reference
    exportFormats: {
      json: 'JSON format with name, category, proficiency, description fields',
      csv: 'CSV format with name, category, proficiency, description columns'
    }
  }
}
