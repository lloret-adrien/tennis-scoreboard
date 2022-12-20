import { useSelector } from "react-redux"
import { selectPlayerHasAdvantage } from "./selectors"

export function PlayerAdvantage({ playerId }) {
  const hasAdvantage = useSelector(selectPlayerHasAdvantage(playerId))

  return (
    <div className={'player player-sets player-points player-advantage' + (hasAdvantage ? ' show' : '')}>
      Av.
    </div>
  )
}
