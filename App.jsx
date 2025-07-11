import { useEffect, useState } from "react";
import Form from "/components/Form";
import MemoryCard from "/components/MemoryCard";

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojisData, setEmojisData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  console.log({ matchedCards, isGameOver });

  useEffect(() => {
    if (
      selectedCards.length === 2 &&
      selectedCards[0].name === selectedCards[1].name
    ) {
      setMatchedCards((prevMatchedCards) => [
        ...prevMatchedCards,
        ...selectedCards,
      ]);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (emojisData.length && matchedCards.length === emojisData.length) {
      setIsGameOver(true);
    }
  }, [matchedCards]);

  async function startGame(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://emojihub.yurace.pro/api/all/category/animals-and-nature"
      );

      if (!response.ok) {
        throw Error("Could not fetch data from API");
      }

      const data = await response.json();
      const dataSlice = getDataSlice(data);
      const emojisArray = getEmojisArray(dataSlice);

      setEmojisData(emojisArray);
      setIsGameOn(true);
    } catch (error) {
      console.error(error);
    }
  }

  function getDataSlice(data) {
    const randomIndices = getRandomIndices(data);

    const dataSlice = randomIndices.reduce((array, index) => {
      array.push(data[index]);
      return array;
    }, []);

    return dataSlice;
  }

  function getRandomIndices(data) {
    const randomIndices = [];

    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * data.length);

      if (!randomIndices.includes(randomNum)) {
        randomIndices.push(randomNum);
      } else {
        i--;
      }
    }

    return randomIndices;
  }

  function getEmojisArray(data) {
    const pairEmojisArray = [...data, ...data];

    // Fisher-Yates shuffle
    for (let i = pairEmojisArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairEmojisArray[i], pairEmojisArray[j]] = [
        pairEmojisArray[j],
        pairEmojisArray[i],
      ];
    }

    return pairEmojisArray;
  }

  function turnCard(name, index) {
    // setSelectedCards([{ name, index }]);

    const selectedCardEntry = selectedCards.find(
      (emoji) => emoji.index === index
    );

    if (!selectedCardEntry && selectedCards.length < 2) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        { name, index },
      ]);
    } else if (!selectedCardEntry && selectedCards.length === 2) {
      setSelectedCards([{ name, index }]);
    }
  }

  return (
    <main>
      <h1>Memory</h1>
      {!isGameOn && <Form handleSubmit={startGame} />}
      {isGameOn && <MemoryCard handleClick={turnCard} data={emojisData} />}
    </main>
  );
}
