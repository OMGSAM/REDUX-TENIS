///app

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { playerScore, resetGame } from './action';

const App = () => {
    const dispatch = useDispatch();
    const { player1, player2, gameStatus, deuce, advantage } = useSelector((state) => state);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Tennis Score</h1>
            <div style={styles.scoreBoard}>
                <h2>Le score est :</h2>
                <p>
                    Joueur 1 : {player1.display} - Joueur 2 : {player2.display}
                </p>
                {deuce && <p style={styles.deuce}>Égalité</p>}
                {advantage && (
                    <p style={styles.advantage}>
                        Avantage : {advantage === 'player1' ? 'Joueur 1' : 'Joueur 2'}
                    </p>
                )}
                {gameStatus !== 'In Progress' && (
                    <h3 style={styles.winMessage}>{gameStatus}</h3>
                )}
            </div>

            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={() => dispatch(playerScore({ player: 'player1' }))}
                >
                    Point Joueur 1
                </button>
                <button
                    style={styles.button}
                    onClick={() => dispatch(playerScore({ player: 'player2' }))}
                >
                    Point Joueur 2
                </button>
                <button style={styles.button} onClick={() => dispatch(resetGame())}>
                    Remettre à zéro
                </button>
                
            </div>
        </div>
    );
};
export default App;


///////// store
import { legacy_createStore } from 'redux';

import reducer from './reducer';

const store = legacy_createStore (reducer)

export default store;


/////////// actionz

export const playerScore = (player) => ({
  type: 'PLAYER_SCORE',
  payload: player, 
});

export const resetGame = () => ({
  type: 'RESET_GAME',
});


///////// reducer

const initialState = {
  player1: { score: 0, display: '0' },
  player2: { score: 0, display: '0' },
  gameStatus: 'In Progress', 
  deuce: false,
  advantage: null,
};

const tennisReducer = (state = initialState, action) => {
  const scoringSteps = ['0', '15', '30', '40'];

  switch (action.type) {
      case 'PLAYER_SCORE': {
          if (state.gameStatus !== 'In Progress') return state; 

          const { player } = action.payload;
          const opponent = player === 'player1' ? 'player2' : 'player1';

          if (state.deuce) {
              if (state.advantage === player) {
                  return {
                      ...state,
                      gameStatus: player === 'player1' ? 'Player 1 Wins' : 'Player 2 Wins',
                  };
              }

              return {
                  ...state,
                  advantage: state.advantage === opponent ? null : player,
              };
          }
          
          const currentScoreIndex = scoringSteps.indexOf(state[player].display);
          if (currentScoreIndex < 3) {
              return {
                  ...state,
                  [player]: {
                      score: state[player].score + 1,
                      display: scoringSteps[currentScoreIndex + 1],
                  },
              };
          }

          
          if (state[player].display === '40' && state[opponent].display === '40') {
              return {
                  ...state,
                  deuce: true,
              };
          }

          if (state[player].display === '40') {
              return {
                  ...state,
                  gameStatus: player === 'player1' ? 'Player 1 Wins' : 'Player 2 Wins',
              };
          }

          return state;
      }

      case 'RESET_GAME':
          return initialState;

      default:
          return state;
  }
};

export default tennisReducer;

/////////// index

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

 
