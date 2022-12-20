import { useStore } from "react-redux"
import { rewind } from "./store"

export function Rewind() {
  const store = useStore()

  return (
    <button
      className="button"
      onClick={() => {
        rewind(store)
      }}
    >
      Rewind
    </button>
  )
}
