import { PlayPauseButton } from "./PlayPauseButton";
import { Player } from "./Player";
import { ResetButton } from "./ResetButton";
import { PointScoredButton } from "./PointScoredButton";
import { PlayerScore } from "./PlayerScore";
import { PlayerSets } from "./PlayerSets";
import { PlayerAdvantage } from "./PlayerAdvantage";
import { Backtrack } from "./Backtrack";
import { Rewind } from "./Rewind";

import { useSelector } from "react-redux";
import { selectCurrentSet, isOver } from "./selectors";

export default function App() {
  const currentSet = useSelector(selectCurrentSet)
  const matchIsOver = useSelector(isOver)

  const setsPlayer1 = []
  const setsPlayer2 = []
  const set = matchIsOver ? currentSet - 1 : currentSet
  for (let i = 0; i < set; i++) {
    setsPlayer1.push(<PlayerSets key={i} playerId="player1" set={i} currentSet={i === currentSet - 1}/>)
    setsPlayer2.push(<PlayerSets key={i} playerId="player2" set={i} currentSet={i === currentSet - 1}/>)
  }
  return (
    <div>
      <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/1/1d/Logo_Roland-Garros.svg/1200px-Logo_Roland-Garros.svg.png" alt="logo roland garros"></img>
      <div className="scoreboard">
        <div className="players">
          <Player playerId="player1"/>
          <Player playerId="player2"/>
        </div>
        <div>
          <div className="usersSets">
            {setsPlayer1}
            {!matchIsOver ? <PlayerScore playerId="player1" /> : ''}
            {!matchIsOver ? <PlayerAdvantage playerId="player1" /> : ''}
          </div>
          <div className="usersSets">
            {setsPlayer2}
            {!matchIsOver ? <PlayerScore playerId="player2" /> : ''}
            {!matchIsOver ? <PlayerAdvantage playerId="player2" /> : ''}
          </div>
        </div>
      </div>
      <div className="mt-10 buttons-row">
        <PointScoredButton playerId="player1">Point player 1</PointScoredButton>
        <PointScoredButton playerId="player2">Point player 2</PointScoredButton>
      </div>
      <div className="buttons-row">
        <ResetButton />
        <PlayPauseButton />
      </div>
      <div className="buttons-row">
        <Backtrack />
        <Rewind />
      </div>
    </div>
  )
}
