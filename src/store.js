import { createStore } from "redux"
import produce from "immer"

const initialState = {
  player1: { id: "player1", name: 'RAFAËL NADAL', points: 0, pointsScored: 0, sets: [], jeux: 0 },
  player2: { id: "player2", name: 'Novak Djokovic', points: 0, pointsScored: 0, sets: [], jeux: 0 },
  service: Math.floor(Math.random() * 2) + 1,
  advantage: null,
  winner: null,
  playing: false,
  history: [], // historique des jeux joués
  currentSet: 1,
  setsToWin: 3, // nombre de set pour gagner
  tieBreak: false,
  isOver: false
}

// let initialState = { isOver: false, "player1": { "name": "player1", "points": 0, "pointsScored": 36, "sets": [1], "jeux": 12 }, "player2": { "name": "player2", "points": 0, "pointsScored": 18, "sets": [], "jeux": 6 }, "advantage": null, "winner": null, "playing": false, "history": [[{ "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }], [{ "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 0, "player2": 40, "winner": "player2" }, { "player1": 0, "player2": 40, "winner": "player2" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 0, "player2": 40, "winner": "player2" }, { "player1": 0, "player2": 40, "winner": "player2" }, { "player1": 0, "player2": 40, "winner": "player2" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }, { "player1": 40, "player2": 0, "winner": "player1" }]], "currentSet": 2, "setsToWin": 3, "tieBreak": false }

const setPlaying = (playing) => ({
  type: "setPlaying",
  payload: playing,
})

const setState = (state) => ({
  type: "setState",
  payload: state,
})

export const restartGame = () => ({ type: "restart" })

export const backtrack = () => ({ type: "backtrack" })

export const pointScored = (player) => ({
  type: "pointScored",
  payload: { player: player },
})

export function autoplay(store) {
  const isPlaying = store.getState().playing
  if (isPlaying || store.getState().winner) {
    // Déjà entrain de jouer, on ne fait rien
    return
  }
  // on indique que la partie est en cours
  store.dispatch(setPlaying(true))
  playNextPoint()
  function playNextPoint() {
    if (store.getState().playing === false) {
      return
    }
    const time = 1000 + Math.floor(Math.random() * 2000)
    window.setTimeout(() => {
      if (store.getState().playing === false) {
        return
      }
      // si oui on marque un point aléatoire
      const pointWinner = Math.random() > 0.5 ? "player1" : "player2"
      store.dispatch(pointScored(pointWinner))
      if (store.getState().winner) {
        store.dispatch(setPlaying(false))
        return
      }
      playNextPoint()
    }, time)
  }
}

let isRewind = false
export function rewind(store) {
  if (isRewind || !store.getState().isOver) return
  isRewind = true
  let i = 0
  playNextPoint()
  function playNextPoint() {
    const time = 1000 + Math.floor(Math.random())
    window.setTimeout(() => {
      store.dispatch(setState(historyStates[i]))
      if (i >= historyStates.length - 1) {
        isRewind = false
        return
      }
      i++
      playNextPoint()
    }, time)
  }
}

function reducer(state = initialState, action) {
  if (action.type === "backtrack") {
    if (historyStates.length > 1) {
      historyStates.pop()
    }
    const lastState = historyStates[historyStates.length - 1]
    isBacktrack = true
    return lastState || state
  }
  if (action.type === "restart") {
    return produce(state, (draft) => {
      // si le jeu est terminé, on ajoute un élément à l'historique
      if (draft.winner) {
        if (!draft.history[draft.currentSet - 1]) draft.history[draft.currentSet - 1] = []
        draft.history[draft.currentSet - 1].push({
          player1: draft.player1.points,
          player2: draft.player2.points,
          winner: draft.winner,
        })
        draft[draft.winner].jeux += 1
        const player1Jeux = draft.history[draft.currentSet - 1].filter((item) => item.winner === draft.player1.id).length
        const player2Jeux = draft.history[draft.currentSet - 1].filter((item) => item.winner === draft.player2.id).length

        // Joueur 1 gagne le Set
        if ((player1Jeux === 6 && player2Jeux <= 4) || player1Jeux === 7) {
          draft.player1.sets.push(draft.currentSet)
          draft.currentSet += 1
        }
        // Joueur 2 gagne le Set
        if ((player2Jeux === 6 && player1Jeux <= 4) || player2Jeux === 7) {
          draft.player2.sets.push(draft.currentSet)
          draft.currentSet += 1
        }
        // Tie-break
        if (player1Jeux === 6 && player2Jeux === 6) {
          draft.tieBreak = draft.currentSet === (draft.setsToWin * 2) - 1 ? 10 : 7
        }
        // Changement de service
        const jeux = draft.player1.jeux + draft.player2.jeux
        if (jeux === 1 || (jeux - 1) % 2 === 0) {
          draft.service = draft.service === 1 ? 2 : 1
        }
        if (draft[draft.winner].sets.length === draft.setsToWin) {
          draft.isOver = true
          console.log("JEU, SET ET MATCH pour ", draft[draft.winner].name, " !")
        }
      }
      // puis on reset les autres propriétés
      draft.player1.points = 0
      draft.player2.points = 0
      draft.advantage = null
      draft.winner = null
      draft.playing = false
    })
  }
  if (action.type === "setPlaying") {
    return produce(state, (draft) => {
      draft.playing = action.payload
    })
  }
  if (action.type === "setState") return action.payload
  if (action.type === "pointScored" && !state.isOver) {
    const player = action.payload.player
    const otherPlayer = player === "player1" ? "player2" : "player1"
    if (state.tieBreak) {
      return produce(state, (draft) => {
        const currentPlayerScore = draft[player].points
        draft[player].points += 1
        draft[player].pointsScored += 1
        if (currentPlayerScore + 1 >= state.tieBreak && (currentPlayerScore + 1) - draft[otherPlayer].points >= 2) {
          draft.winner = player
          draft.tieBreak = false
          return
        }
      })
    }
    return produce(state, (draft) => {
      const currentPlayerScore = draft[player].points
      if (currentPlayerScore <= 15) {
        // 0 ou 15 => on ajoute 15
        draft[player].points += 15
        draft[player].pointsScored += 1
        return
      }
      if (currentPlayerScore === 30) {
        draft[player].points = 40
        draft[player].pointsScored += 1
        return
      }
      if (currentPlayerScore === 40) {
        if (draft[otherPlayer].points !== 40) {
          // Le joueur à gagné le jeu
          draft.winner = player
          return
        }
        if (draft.advantage === player) {
          // Le joueur à gagné le jeu
          draft.winner = player
          return
        }
        if (draft.advantage === null) {
          // Le joueur a maintenant l'avantage
          draft.advantage = player
          return
        }
        // L'autre joueur a perdu l'avantage
        draft.advantage = null
        return
      }
    })
  }
  return state
}

export const store = createStore(reducer)

let historyStates = [initialState], isBacktrack = false, isRestart = false
store.subscribe(() => {
  const state = store.getState()
  if (isBacktrack || state.isOver || isRewind || isRestart) {
    isBacktrack = false
    isRestart = false
    return
  }
  console.log("Nouveau state:")
  console.log(state)
  historyStates.push(state)
  const winner = state.winner
  if (winner) {
    isRestart = true
    store.dispatch(restartGame())
  }
})
