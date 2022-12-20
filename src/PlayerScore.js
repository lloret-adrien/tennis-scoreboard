import { useSelector } from "react-redux"
import { selectPlayerScore } from "./selectors"

export function PlayerScore({ playerId }) {
  const score = useSelector(selectPlayerScore(playerId))

  return (
    <div className="player player-sets player-points">
      {score}
    </div>
  )
}
