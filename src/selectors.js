export const selectPointBeforeWin = (playerId) => {
  const otherPlayerId = playerId === "player1" ? "player2" : "player1";
  return (state) => {
    if (state.winner) {
      return null;
    }
    if (state.advantage === playerId) {
      return 1;
    }
    if (state.advantage === otherPlayerId) {
      return 3;
    }
    const playerScore = state[playerId].points;
    const otherPlayerScore = state[otherPlayerId].points;
    const pointsTo40 =
      playerScore === 0
        ? 3
        : playerScore === 15
        ? 2
        : playerScore === 30
        ? 1
        : 0;
    if (otherPlayerScore === 40) {
      return pointsTo40 + 2;
    }
    return pointsTo40 + 1;
  };
}

export const selectPlayerHasAdvantage = (playerId) => {
  return (state) => state.advantage === playerId;
}

export const selectPlayerHasService = (playerId) => {
  return (state) => "player" + state.service === playerId;
}

export const selectPlayerScore = (playerId) => {
  return (state) => state[playerId].points;
}

export const selectDisplayText = (state) => {
  if (state.winner) {
    if (state.winner === "player1") {
      return "Joueur 1 gagne le jeu";
    } else {
      return "Joueur 2 gagne le jeu";
    }
  } else {
    let text = "Le score est: " + state.player1.points + " - " + state.player2.points;
    if (state.advantage) {
      if (state.advantage === "player1") {
        text += " avantage joueur 1";
      } else {
        text += " avantage joueur 2";
      }
    }
    return text;
  }
}

export const selectPlayerPoints = (playerId, set = 0) => {
  return (state) =>
    state.history[set]?.filter((item) => item.winner === playerId).length || 0
}

export const selectGameIsPlaying = (state) => state.playing

export const selectCurrentSet = (state) => state.currentSet

export const isOver = (state) => state.isOver

export const playerWinSet = (playerId, set = 1) => {
  return (state) => state[playerId].sets.includes(set)
}

export const selectPlayerName = (playerId) => {
  return (state) => state[playerId].name
}
