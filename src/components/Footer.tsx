import { HiOutlineX } from "solid-icons/hi"
import { Component, createSignal } from "solid-js"
import Modal from "./Modal"

const Footer: Component = () => {
  const [contact, setContact] = createSignal(false)

  return (
    <div class="w-full flex divide-x bg-white">
      <Modal activator={contact()}>
        <div class="shadow flex items-center w-full py-2 px-4">
          <p class="flex-1 font-bold text-2xl">Contact me</p>
          <button
            class="inline-flex items-center justify-center"
            onClick={() => setContact(false)}
          >
            <HiOutlineX class="text-xl" />
          </button>
        </div>
        <p class="p-2">
          Hey, I'm Victor. The creator of SpecFi Visualizer. You can contact me
          on discord: vlourme#5498.
          <br />
          <br />
          You can also support this website and its development by making a
          small tip to the address below, thank you 😀
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
        onClick={() => setContact((v) => !v)}
        class="flex items-center hover:bg-gray-300 transition-colors px-4 py-2"
      >
        Contact
      </button>
    </div>
  )
}

export default Footer
