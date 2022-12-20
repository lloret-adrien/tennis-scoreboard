import { useDispatch } from "react-redux"
import { backtrack } from "./store"

export function Backtrack() {
  const dispatch = useDispatch()

  return (
    <button
      className="button"
      onClick={() => {
        dispatch(backtrack())
      }}
    >
      Backtrack
    </button>
  )
}
