import { Link } from "solid-app-router"
import { HiOutlineArrowLeft } from "solid-icons/hi"
import { Component } from "solid-js"
import { Store } from "solid-js/store"
import { StoreType } from "../pages/Contract.data"

type Props = {
  store: Store<StoreType>
}

const Navbar: Component<Props> = (props) => {
  return (
    <div class="w-full lg:flex lg:px-8 bg-white">
      <div class="flex-1 px-8 lg:px-0 flex items-center py-3 space-x-4">
        <Link
          class="hover:bg-gray-200 transition-colors flex items-center justify-center w-8 h-8 rounded-full"
          href="/"
        >
          <HiOutlineArrowLeft class="text-black text-xl" />
        </Link>
        <h1 class="font-bold text-2xl">{props.store.name}</h1>
      </div>
      <div class="flex divide-x border-t lg:border-t-0 border-l border-r">
        <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
          DPR: {props.store.dpr} %
        </div>
        <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
          APY: {props.store.apy} %
        </div>
        <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
          Last block: {props.store.block}
        </div>
      </div>
    </div>
  )
}

export default Navbar
