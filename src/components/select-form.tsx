import { useNavigate } from "solid-app-router"
import { Component, For } from "solid-js"
import { createStore } from "solid-js/store"

type Props = {
  contracts: any
}

const SelectForm: Component<Props> = (props) => {
  const navigate = useNavigate()

  const [store, setStore] = createStore({
    address: "",
    vault: "",
  })

  const submit = (e: Event) => {
    e.preventDefault()
    navigate(`/contract/${store.vault}/${store.address}`)
  }

  return (
    <form
      onSubmit={(e) => submit(e)}
      class="w-full lg:w-lg p-4 space-y-2 rounded-md bg-white shadow-lg"
    >
      <h1 class="text-2xl font-bold">Watch your yields growing 🚀</h1>
      <div>
        <label for="address" class="text-sm text-gray-500">
          Terra address
        </label>
        <input
          required
          value={store.address}
          onChange={(e) => setStore("address", e.currentTarget.value)}
          class="w-full border-b px-2 py-1"
          placeholder="e.g.: terra1..."
        />
      </div>
      <div>
        <label for="address" class="text-sm text-gray-500">
          Vault
        </label>
        <select
          onChange={(e) => setStore("vault", e.currentTarget.value)}
          required
          class="block w-full border-b px-2 py-1"
        >
          <option selected disabled>
            —— Select a LP vault ——
          </option>
          <For
            each={Object.entries(props.contracts.coinInfos).sort(
              ([_, a], [__, b]) => String(a).localeCompare(String(b))
            )}
          >
            {([addr, name]: [string, string]) => (
              <option value={addr}>{name}-UST</option>
            )}
          </For>
        </select>
      </div>
      <div class="pt-4 flex justify-end">
        <button class="px-2 py-1 rounded-md border shadow hover:bg-gray-100 transition-colors">
          Show rewards
        </button>
      </div>
    </form>
  )
}

export default SelectForm
