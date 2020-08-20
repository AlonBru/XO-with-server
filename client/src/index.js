import React,{useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import {Modal} from "@material-ui/core";
import axios from 'axios'
import WinnerList from './WinnerList'

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
      const [gameWon , setGameWon] = useState(false);
      const [history,setHistory] = useState([{squares: Array(9).fill(null)}]);
      const [xIsNext,setXIsNext] = useState(true);
      const [stepNumber,setStepNumber] = useState(0);
      const [theWinnerName,setTheWinnerName] = useState('')
      const [theWinners , setTheWinners]=useState([])
      const [timerStart, setTimerStart]=useState('')
      const [timerEnd, setTimerEnd]=useState('')
    
    function handleClick(i) {
      const newHistory = history.slice(0, stepNumber + 1);
      const current = newHistory[newHistory.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }console.log(newHistory);
      stepNumber===0?setTimerStart(new Date().getTime()):console.log('do not work');; 
      console.log(history);
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
        setStepNumber( step);
        setXIsNext ((step % 2) === 0);
    }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move? 
        "Go to move #" + move : 
        'Go to game start';
      return (
          <div key={move}>
            <button onClick={() => jumpTo(move)}>{desc}</button>
          </div>
        );
      });
    
      let status;
      if(winner){
        status = `Winner: ${winner}`;
        if(!gameWon){
          setGameWon(true);
        }
      } else { 
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
      }
      function handleClose(){
        setGameWon(false);
        setHistory([{squares: Array(9).fill(null)}]);
        setXIsNext(true);
        setStepNumber(0);
        setTheWinners([])
      }

      async function addNameToRecords(){
        handleClose()
        console.log(Math.floor((timerEnd-timerStart)/1000));
        const winerObj= {winnerName: theWinnerName, date: new Date().toLocaleString(),gameTime: Math.floor((timerEnd-timerStart)/1000)}
        const response = await axios.post('/api/records', winerObj); 
      }

      async function showWinners(){
        if(theWinners[0]===undefined){
        const response = await axios.get('/api/records');
        setTheWinners(response.data)
        }else{
          setTheWinners([]) 
        }
      }
  
      useEffect(()=>{
        if(gameWon)
        setTimerEnd(new Date().getTime())
        console.log(timerEnd);
      },[gameWon])

      return (
        <div>
        <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={i => handleClick(i)}
              />
              </div>
              <div className="game-info">
                <div>{status}</div>
                <div>{moves}</div>
              </div>
          </div>
          <div className="winnersDiv">
            <button onClick={showWinners}>Show all the winners</button>
            <WinnerList theWinners={theWinners}/>
          </div>
          <Modal open = {gameWon} onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          >
              <div style={{position:'relative',  backgroundColor:"wheat"}}>
                <h1> CHAMPION, YOU WON!</h1>
                <div><b>Date: </b> {new Date().toLocaleString()}, <b>Time of the game: </b> {Math.floor((timerEnd-timerStart)/1000)} sec</div>
                <input onChange={e => setTheWinnerName(e.target.value)}  placeholder="Enter your name"/>
                <button onClick={addNameToRecords}>add your name to the winner list</button>
              </div>
          </Modal>
        </div>

      );
    
  }
  
  
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