import React, { useState }  from 'react';
import './App.css';
import { Button } from 'react-materialize'

function App() {

  const squareNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,""];
  const [tiles, setTiles] = useState(startingPosition());
  const [numberMoves, setNumberMoves] = useState(0);
  const [win, setWin] = useState(false);

  function startingPosition (){
  let returnLocalStorage = JSON.parse(localStorage.getItem("tiles"));
     if (returnLocalStorage){
       return returnLocalStorage;
     } else {
       return Randomized();
     }
   }

  function saveLocalStorage (info){
    let tilesForLocalStorage = JSON.stringify(info);
    localStorage.setItem("tiles", tilesForLocalStorage);
  }

  function Randomized() {
    let clonesQuareNumbers = squareNumbers.map( number => number );
    clonesQuareNumbers.sort(function(){ return 0.5-Math.random() });
    saveLocalStorage (clonesQuareNumbers);
    return clonesQuareNumbers;
  }

  function NewGame (level) {
    if (level === "hard"){
      setTiles(Randomized());
    } else {
      setTiles(squareNumbers);
      saveLocalStorage (squareNumbers);
    }
    setNumberMoves(0);
    setWin(false);
  }

  const Move = (index) => {
    const Tiles = [...tiles];
    let possibleMoves = [index - 4, index + 4];
    if(index !== 4 && index !== 8 && index !== 12){
      possibleMoves.push( index - 1 );
    }
    if(index !== 3 && index !== 7 && index !== 11){
      possibleMoves.push( index + 1 );
    }
    for (let i = 0; i < 4; i++) {
      if (tiles[possibleMoves[i]] === ""){
        Tiles[possibleMoves[i]] = Tiles[index];
        Tiles[index] = "";
        setWin(winСheck(Tiles));
        setTiles(Tiles);
        setNumberMoves(numberMoves + 1);
        saveLocalStorage (Tiles);
        return;
      }
    }
  }

  const winСheck = (tiles) => {
    let check = true;
    for (let i = 0; i < tiles.length-1; i++) {
      if(tiles[i] !== i+1){
        return false;
      }
    }
    return check;
  }

  return (
    <div className="App">
      <div className={win ? "PlayingField PlayingFieldWin" : "PlayingField"}>
        {tiles.map((tile, index) => (
          <div className={tile === (index+1) ? "Tile CorrectPosition" : "Tile"} key={index} onClick={() => Move(index)}>{tile}</div>
        ))}
      </div>
      <p>
        Number of moves: {numberMoves}
        {win ? <span className='ForWin'>YOU WIN!</span> : ""}
      </p>
      <div className="BoxForBtn">
        <Button onClick={() => NewGame("hard")}> New Game (hard) </Button>
        <Button onClick={() => NewGame("easy")}> New Game (easy) </Button>
      </div>
    </div>
  );
}

export default App;
