# CebuaKnows React

A modern, interactive web application for exploring Cebu Province, Philippines. Built with React, Next.js, and TypeScript.

## 🌟 Features

- **Interactive Map Navigation**: Smooth, animated SVG map of Cebu Province with clickable regions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful animations and transitions using Framer Motion
- **Type Safety**: Built with TypeScript for better development experience
- **State Management**: Efficient state management with Zustand
- **Error Boundaries**: Robust error handling throughout the application
- **Performance Optimized**: Built with Next.js for optimal performance and SEO

## 🗺️ What You Can Explore

- **44 Municipalities** and **7 Cities** in Cebu Province
- **Hotels & Accommodations**: Find the best places to stay
- **Restaurants & Coffee Shops**: Discover local cuisine and cafes
- **Tourist Attractions**: Explore must-visit destinations
- **Local Services**: Car rentals, churches, and more
- **Cultural Sites**: Historical landmarks and religious sites

## 🚀 Getting Started

<!-- 
### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cebuaknows
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application. 
-->

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework for production
- **[React 18](https://reactjs.org/)** - JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for React
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon toolkit

<!-- 
## 📁 Project Structure

```
cebuaknows/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [location]/         # Dynamic location pages
│   │   ├── place/              # Place inquiry pages
│   │   ├── about/              # About page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   │   ├── ErrorBoundary.tsx   # Error boundary component
│   │   ├── HeaderDisplay.tsx   # Header component
│   │   ├── MapDisplay.tsx      # Interactive map component
│   │   ├── RegionModal.tsx     # Region information modal
│   │   ├── SideBarNavigation.tsx # Navigation sidebar
│   │   └── SkeletonLoader.tsx  # Loading skeleton
│   ├── stores/                 # Zustand state stores
│   │   ├── apiStore.ts         # API state management
│   │   └── mapStore.ts         # Map state management
│   └── data/                   # Static data files
│       └── cebuMapData.ts      # SVG map path data
├── public/                     # Static assets
│   ├── logo.png               # Application logo
│   └── logo2.png              # Alternative logo
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
``` 
-->

## 🎨 Key Features Explained

### Interactive Map
The centerpiece of the application is an interactive SVG map of Cebu Province. Users can:
- Click on any region to explore it
- See smooth zoom and pan animations
- View tooltips with region names on hover
- Experience responsive design across all devices

### Dynamic Routing
The application uses Next.js App Router for:
- `/` - Home page with the interactive map
- `/[location]` - Location-specific pages showing available services
- `/place/[location]/[inquiry]` - Detailed inquiry results
- `/about` - Information about the application

### State Management
Zustand stores handle:
- **Map State**: Selected regions, zoom levels, loading states
- **API State**: Caching, loading states, error handling

### Enhanced UI/UX
- **Smooth Animations**: Framer Motion powers all transitions
- **Responsive Design**: Works perfectly on all screen sizes
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Loading States**: Skeleton loaders and loading indicators
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Quality

The project includes:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (recommended)

## 🌐 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers

### Build for Production

```bash
npm run build
npm run start
```

<!-- 
## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 
-->

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

<!-- - Original Vue.js CebuaKnows application for inspiration -->
- Cebu Province tourism data and information
- Open source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help with the application, please:
1. Check the [Issues](../../issues) page
2. Create a new issue if your question isn't already answered
3. Provide detailed information about your problem

---

**Made with ❤️ for exploring the beautiful province of Cebu, Philippines**