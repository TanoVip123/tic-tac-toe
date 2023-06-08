import React, { useReducer } from 'react'
import Board from './Board'

const reducer = (state, action) => {
    switch (action.type)
    {
        case 'MOVE':
            return {...state, history: state.history.concat({squares: action.payload.squares}), xIsNext: !state.xIsNext};
        case 'JUMP':
            return {...state, xIsNext: action.payload.step%2 === 0, history: state.history.slice(0, action.payload.step + 1)};
        default:
            return state;    
    }
}
export default function Game() {
    const [state, dispatch] = useReducer(reducer, {
        xIsNext: true,
        history: [{squares: Array(9).fill(null)}]
    });
    const {xIsNext, history} = state;
    const handleClick = (i) => {
        const current = history[history.length - 1];
        //copy the last board map
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        //if there is already a winner or we clicked in the same spot -> ignore the event
        if(winner || squares[i])
        {
            return;
        }
        squares[i] = xIsNext ? 'X' : '0';
        dispatch({type:'MOVE', payload: {squares}})
    };

    const jumpTo = (step) => {
        dispatch({type: 'JUMP', payload:{step}});
    }

    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    const status = winner? winner === 'D' ? ' Draw' : 'Winner is ' + winner : 'Next player is ' + (xIsNext? 'X' : '0');
    const moves = history.map((step, move) => {
        const desc = move? 'Go to #' + move : 'Start the Game';
        return <li key = {step}>
            <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
    });
  return (
    <div className='game'>
        <div className='game-board'>
            <Board onClick={(i) => handleClick(i)} squares={current.squares}></Board>
        </div>
        <div className='game-info'>
            <div>
            {status}
            </div>
            <ul>
            {moves}
            </ul>
        </div>
    </div>
  )
}

const calculateWinner = (squares) => {
    const winnerLines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    let isDraw = true;
    for (let i =0; i < winnerLines.length; i++)
    {
        const [a, b, c] = winnerLines[i];
        if(squares[a] && squares[b] && squares[c] && squares[a] === squares[b] && squares[b] === squares[c]) 
        {
            return squares[a];
        }

        if(!squares[a] || !squares[b] || !squares[c])
        {
            isDraw = false;
        }
    }

    if (isDraw)
    {
        return 'D';
    }
    return null;
}
