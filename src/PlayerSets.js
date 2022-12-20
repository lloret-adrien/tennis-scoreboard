import { useSelector } from "react-redux"
import { selectPlayerPoints, playerWinSet } from "./selectors"

export function PlayerSets({ playerId, set, currentSet }) {
  const playerPoints = useSelector(selectPlayerPoints(playerId, set))
  const winSet = useSelector(playerWinSet(playerId, set+1))

  return (
    <span className={`player player-sets${currentSet ? ' current' : ''}${!winSet && !currentSet ? ' lose' : ''}`}>
      {playerPoints}
    </span>
  )
}
