import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Modal } from '@material-ui/core';
import Axios from 'axios';
import HallOfFame from './HallOfFame';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
function Board (props) {
    const renderSquare = (i) => {
      return <Square 
      value={ props.squares[i]} 
      onClick = {()=> props.onClick(i)}/>;
    }   
    return (
    <div>
        <div className="board-row">
        { renderSquare(0)}
        { renderSquare(1)}
        { renderSquare(2)}
        </div>
        <div className="board-row">
        { renderSquare(3)}
        { renderSquare(4)}
        { renderSquare(5)}
        </div>
        <div className="board-row">
        { renderSquare(6)}
        { renderSquare(7)}
        { renderSquare(8)}
        </div>
    </div>
    );
  }
  
  function Game(){

    const [history,setHistory] = useState([{squares: Array(9).fill(null)}])
    const [xIsNext,setXIsNext] = useState(true)
    const [stepNumber,setStepNumber] = useState(0)
    const [gameIsWon,setGameIsWon] = useState(false)
    const [resultLogged,setResultLogged] = useState(false)
    const [winnerName,setWinnerName] = useState("")
    const [gameLength,setGameLength] = useState(0)
    
    useEffect(timer,[gameLength])

    function timer(){
            if(gameIsWon)return;
            setTimeout(() => {
                console.log( gameLength)
              setGameLength(gameLength + 1)  
            }, 1000);
    } 
    function handleClick(i) {
      const newHistory = history.slice(0, stepNumber + 1);
      const current = newHistory[newHistory.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = xIsNext ? 'X' : 'O';
      
        setHistory (newHistory.concat([
            {
                squares: squares
            }
        ]))
          setStepNumber( newHistory.length)
          setXIsNext(!xIsNext)      
    }

    function jumpTo(step) {
        setGameIsWon(false);
        setResultLogged(false);
        setStepNumber( step);
        setXIsNext ((step % 2) === 0);
        if(step===0){setGameLength(0)}
    }
      const current = history[stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const desc = move ?
        `Go to move #${move}`:
        `Go to game start`;
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      
      if(winner){
          status = `Winner: ${winner}`;
          if (!gameIsWon&&resultLogged===false) {setGameIsWon(true)}
      } else { 
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
      }
      
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <HallOfFame/>
          <Modal open={gameIsWon&& !resultLogged} onClose={(e)=>{
              setGameIsWon(false);
              setResultLogged(true);
            }}>
            <div>
                <h1>you win!</h1>
                <input 
                    placeholder='what is your name?' 
                    onChange={(e)=>{
                        let query= e.target.value;
                        setWinnerName(query);
                }} />
                <button onClick={()=>{
                    const date = new Date();
                    let winnerObject ={
                        winnerName: winnerName,
                        date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                        time: gameLength+' seconds'
                        }
                    setResultLogged(true);
                    console.log(winnerObject)
                    Axios.post('/api/v1/records', winnerObject);
                }}> send </button>                
            </div>
          </Modal>
        </div>
      );
    
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById('root'));

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }