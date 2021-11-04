import { Component, Show } from "solid-js"

type Props = {
  activator: boolean
}

const Modal: Component<Props> = (props) => {
  return (
    <Show when={props.activator}>
      <div class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-35">
        <div class="bg-white max-w-md min-h-xs shadow-lg rounded-md">
          {props.children}
        </div>
      </div>
    </Show>
  )
}

export default Modal
