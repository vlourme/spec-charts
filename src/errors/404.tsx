import { Link } from "solid-app-router"

export default function NotFound() {
  return (
    <section class="flex flex-col items-center justify-center h-screen">
      <p class="text-4xl">😰</p>
      <h1 class="text-2xl font-semibold">This page does not exists.</h1>
      <Link class="mt-8 border-b hover:text-blue-500" href="/">
        Go to the homepage
      </Link>
    </section>
  )
}
