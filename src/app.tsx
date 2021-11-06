import { useRoutes } from "solid-app-router"
import type { Component } from "solid-js"
import { routes } from "./routes"

const App: Component = () => {
  const Route = useRoutes(routes)

  return (
    <main class="bg-gray-100 min-h-screen w-screen flex flex-col items-center subpixel-antialiased">
      <Route />
    </main>
  )
}

export default App
