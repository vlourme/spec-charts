import type { RouteDefinition } from "solid-app-router"
import { lazy } from "solid-js"

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/home")),
  },
  {
    path: "/contract/:contract/:address",
    component: lazy(() => import("./pages/contract")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
]
