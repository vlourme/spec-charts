import { HiOutlineRefresh } from "solid-icons/hi"
import { Component, createSignal, onMount, Show } from "solid-js"
import APYChart from "../components/apy-chart"
import Footer from "../components/footer"
import SelectForm from "../components/select-form"
import { getContractsList } from "../lib/contract"

const Home: Component = () => {
  const [contracts, setContracts] = createSignal<any>()

  onMount(async () => {
    setTimeout(async () => {
      const data = await getContractsList()
      setContracts(data)
    }, 1000)
  })

  return (
    <div class="min-h-screen h-full w-full flex flex-col">
      <Show
        when={contracts()}
        fallback={
          <h1 class="flex-1 text-3xl font-bold flex space-y-2 flex-col items-center justify-center">
            <HiOutlineRefresh class="animate-spin" />
            <p>Loading vaults, please wait...</p>
          </h1>
        }
      >
        <div class="flex-1 flex flex-col space-y-4 max-w-7xl mx-auto items-center justify-center">
          <SelectForm contracts={contracts()} />
          <APYChart contracts={contracts()} />
        </div>
      </Show>
      <Footer />
    </div>
  )
}

export default Home
