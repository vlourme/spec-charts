import { HiOutlineCash, HiOutlineCode } from "solid-icons/hi"
import { Component } from "solid-js"

const Footer: Component = () => {
  return (
    <div class="w-full md:flex items-center justify-between px-8 py-2 bg-gray-100 shadow-inner">
      <a
        class="flex items-center space-x-2 text-blue-700 hover:text-blue-800"
        href="https://github.com/vlourme/spec-charts"
      >
        <HiOutlineCode class="text-lg" />
        <span>GitHub</span>
      </a>

      <div class="flex items-center space-x-2">
        <HiOutlineCash />
        <p>
          Donate: <code>terra1m0yqklfwed9mp8fcua9cqmyu32cnllstkvkluk</code>
        </p>
      </div>
    </div>
  )
}

export default Footer
