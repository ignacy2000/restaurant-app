import { Providers } from './providers'
import { AppHeader } from './AppHeader'
import { AppRouter } from './router'

export default function App() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <AppRouter />
        </main>
      </div>
    </Providers>
  )
}
