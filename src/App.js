import React, { useState }  from 'react';
import './App.css';
import { Button } from 'react-materialize'

const infoFromLocalStorage = JSON.parse(localStorage.getItem('game'));

const App = () => {

  const squareNumbers = [...[...[...Array(16).keys()].slice(1)], 0]; // [1-16, 0];
  const randomized = () => squareNumbers.sort( () => 0.5-Math.random());
  const newRandomized = () => {
      // TODO new randomizer
      // const
      // for (let i = 0; i < 100; i++) {
      //     // const rendomMove = randomized()[0];
      //     // console.log(i, ') rendomMove - ', rendomMove);
      //     // checkAndMove(rendomMove);
      //     // // setTimeout(() => checkAndMove(rendomMove), 2000);
      // }
  };

  const startingPosition = name => {
      if (infoFromLocalStorage && infoFromLocalStorage[name]) return infoFromLocalStorage[name];
      if (name === 'tiles') return randomized();
      if (name === 'level') return 'hard';
      return 0;
  };

  const [tiles, setTiles] = useState(startingPosition('tiles'));
  const [numberMoves, setNumberMoves] = useState(startingPosition('numberMoves'));
  const [level, setLevel] = useState(startingPosition('level'));
  const [bestResult, setBestResult] = useState(startingPosition('bestResult'));
  const [win, setWin] = useState(false);

  const saveInLocalStorage = (infoForLocalStorage) => {
      localStorage.setItem('game', JSON.stringify(infoForLocalStorage));
  };

  const savePosition = (tiles, numberMoves, newLevel = level) => {
    setTiles(tiles);
    setNumberMoves(numberMoves);
    saveInLocalStorage({tiles, numberMoves, level : newLevel});
  };

  const saveBestResult = (numberMoves) => {
    setBestResult(numberMoves);
    saveInLocalStorage({ bestResult : numberMoves });
  };

  const newGame = newLevel => {
    setLevel(newLevel);
    setWin(false);
    savePosition(newLevel === 'hard' ? randomized() : squareNumbers,0, newLevel);
  };

  const winCheck = tiles => {
    for (let i = 0; i < tiles.length-1; i++) {
      if (tiles[i] !== i + 1) {
          return false;
      }
    }
    if (level === 'hard' && (bestResult === 0 || bestResult > numberMoves)) {
        saveBestResult(numberMoves + 1);
    }
    return true;
  };

  const checkPossibleMove = (index) => {
      if (tiles[index - 4] === 0) return  index - 4;
      if (tiles[index + 4] === 0) return index + 4;
      if (tiles[index - 1] === 0 && index !== 4 && index !== 8 && index !== 12) return index - 1;
      if (tiles[index + 1] === 0 && index !== 3 && index !== 7 && index !== 11) return index + 1;
      return false
  };

  const checkAndMove = (index) => {
    const indexForMove = checkPossibleMove(index);
    if (indexForMove !== false) {
      const newTiles = [...tiles];
      [newTiles[indexForMove], newTiles[index]] = [newTiles[index], newTiles[indexForMove]];
      setWin(winCheck(newTiles));
      savePosition(newTiles, numberMoves + 1);
    }
  };

  const getDesign = (tile, index) => {
      if (tile === 0) return 'Empty';
      if (tile === index + 1) return 'CorrectPosition';
      return null;
  };

  const getDirection = (index) => {
      const numberofDerection = checkPossibleMove(index);
      if (numberofDerection === index - 4) return 'Up';
      if (numberofDerection === index + 4) return 'Down';
      if (numberofDerection === index - 1) return 'Left';
      if (numberofDerection === index + 1) return 'Right';
      return '';
  };

  const startNewGame = () => window.confirm(`YOU WIN!!
      ${numberMoves === bestResult ? 'New Record!! ' : ''} Moves: ${numberMoves}. Start new game (hard)?`)
          ? newGame('hard')
          : null;

  return (
    <div className='App'>
      <div className={`PlayingField ${win ? 'PlayingFieldWin' : null}`}  onClick={() => win ? startNewGame() : null}>
        {tiles.map((tile, index) => (
          <div className={`Tile ${getDesign(tile, index)}`}
               key={index}
               onClick={() => checkAndMove(index, tile)}>
            {tile}
            <span className='Index' > {index + 1} </span>
            <span className='Direction'> {getDirection(index)} </span>
          </div>
        ))}
      </div>
      {win ? <span className='ForWin'>YOU WIN!</span> : ''}
      <div className='BoxForInfo'>
        <p>
          You play:
          <span className={level === 'hard' ? 'Red' : 'Green'}>
              {level === 'hard' ? ' Hard ' : ' Easy '}
          </span>
          level
        </p>
        <p>
          Number of moves:<span className='Red'> {numberMoves} </span>
        </p>
      </div>
      <div className='BoxForInfo'>
        <p> Your best result (only Hard level):
            <span className='Red'> {bestResult} </span>
        </p>
        <Button size="small" color="secondary" variant="contained" disabled={bestResult === 0}
                onClick={() => window.confirm(`Reset your best result - ${bestResult} ?`)
                    ? saveBestResult(0) : null}
        >
          reset
        </Button>
      </div>
      <div className='BoxForBtn'>
        <Button onClick={() => newGame('hard')}> New Game (hard) </Button>
        <Button onClick={() => newGame('easy')}> New Game (easy) </Button>
      </div>
      <Button onClick={() => newRandomized()}> newRandomized </Button>
    </div>
  );
};

export default App;
