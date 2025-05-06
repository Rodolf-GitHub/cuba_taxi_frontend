import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="h-24 w-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Vite + React
      </h1>
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors mb-4"
        >
          count is {count}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors mb-4"
        >
          {isOpen ? 'Cerrar' : 'Abrir'} Detalles
        </button>
        <div 
          className={`grid transition-all duration-200 ease-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-muted-foreground text-center py-2">
              Edit <code className="bg-muted px-1 rounded">src/App.tsx</code> and save to test HMR
            </p>
          </div>
        </div>
      </div>
      <p className="mt-8 text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
