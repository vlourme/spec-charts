import { useRoutes } from "solid-app-router"
import type { Component } from "solid-js"
import { routes } from "./routes"

const App: Component = () => {
  const Route = useRoutes(routes)

  return (
    <main class="bg-gray-50 min-h-screen h-full flex flex-col items-center subpixel-antialiased">
      <Route />
    </main>
  )
}

export default App
