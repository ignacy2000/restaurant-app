import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../shared/contexts/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  )
}
