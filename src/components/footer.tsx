import { HiOutlineX } from "solid-icons/hi"
import { Component, createSignal } from "solid-js"
import Modal from "./Modal"

const Footer: Component = () => {
  const [donate, setDonate] = createSignal(false)

  return (
    <div class="w-full flex divide-x bg-gray-100 shadow-inner">
      <Modal activator={donate()}>
        <div class="shadow flex items-center w-full py-2 px-4">
          <p class="flex-1 font-bold text-2xl">Make a donation</p>
          <button
            class="inline-flex items-center justify-center"
            onClick={() => setDonate(false)}
          >
            <HiOutlineX class="text-xl" />
          </button>
        </div>
        <p class="p-2">
          This website is a small experiment, it's entirely free and it always
          be. You can make a little donation to keep this project up.
        </p>
        <div class="p-2">
          <label class="block text-sm text-gray-500">
            Terra address for donations:
          </label>
          <input
            class="w-full px-3 py-1 rounded-md border shadow"
            value="terra1m0yqklfwed9mp8fcua9cqmyu32cnllstkvkluk"
            readonly
          />
        </div>
      </Modal>

      <a
        class="flex items-center hover:bg-gray-300 transition-colors px-4 py-2"
        href="https://github.com/vlourme/spec-charts"
      >
        GitHub
      </a>

      <button
        onClick={() => setDonate((v) => !v)}
        class="flex items-center hover:bg-gray-300 transition-colors px-4 py-2"
      >
        Donate
      </button>
    </div>
  )
}

export default Footer
