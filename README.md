# My Vite App

This is a Vite project set up with React and TypeScript. It serves as a starting point for building responsive web applications.

## Project Structure

```
my-vite-app
├── index.html          # Main HTML file
├── package.json        # NPM configuration file
├── tsconfig.json       # TypeScript configuration file
├── vite.config.ts      # Vite configuration file
├── public
│   └── robots.txt      # Robots.txt for search engine indexing
├── src
│   ├── main.tsx        # Entry point for the React application
│   ├── App.tsx         # Main App component
│   ├── index.css       # Global CSS styles
│   ├── pages
│   │   └── Home.tsx    # Home component (responsive starting page)
│   ├── components
│   │   └── FullscreenLayout.tsx # Layout component for full viewport
│   ├── hooks
│   │   └── useAuth.ts   # Custom hook for user authentication
│   ├── types
│   │   └── index.d.ts    # TypeScript type definitions
│   └── utils
│       └── helpers.ts    # Utility functions
└── README.md           # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd my-vite-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Features

- Responsive design that covers the whole screen.
- Custom hook for managing user authentication.
- Modular structure with components, hooks, and utilities.

## License

This project is licensed under the MIT License.