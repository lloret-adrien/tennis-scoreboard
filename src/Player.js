import { useSelector } from "react-redux"
import { selectPlayerName, selectPlayerHasService } from "./selectors"

export function Player({ playerId }) {
  const playerName = useSelector(selectPlayerName(playerId))
  const playerService = useSelector(selectPlayerHasService(playerId))

  return <p className={"player player-name" + (playerService ? ' player-service' : '')}>{playerName}</p>
}
