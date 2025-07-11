import { useEffect, useState } from "react";
import Form from "/components/Form";
import MemoryCard from "/components/MemoryCard";
import AssistiveTechInfo from "./components/AssistiveTechInfo";
import GameOver from "./components/GameOver";
import ErrorCard from "./components/ErrorCard";

export default function App() {
  const initialFormData = {
    category: "animals-and-nature",
    number: 10,
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojisData, setEmojisData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [areAllCardsMatched, setAreAllCardsMatched] = useState(false);
  const [isError, setIsError] = useState(false);

  console.log({ matchedCards, areAllCardsMatched, selectedCards, isError });

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
      setAreAllCardsMatched(true);
    }
  }, [matchedCards]);

  async function startGame(e) {
    e.preventDefault();

    try {
      // throw new Error("We're throwing an error");
      const response = await fetch(
        `https://emojihub.yurace.pro/api/all/category/${formData.category}`
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
      setIsError(error);
    } finally {
      setIsFirstRender(false);
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

    for (let i = 0; i < formData.number / 2; i++) {
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

    if (selectedCards.length < 2) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        { name, index },
      ]);
    } else if (selectedCards.length === 2) {
      setSelectedCards([{ name, index }]);
    }
  }

  function resetGame() {
    setIsGameOn(false);
    setSelectedCards([]);
    setMatchedCards([]);
    setAreAllCardsMatched(false);
  }

  function resetError() {
    setIsError(false);
  }

  function handleFormChange(e) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <main>
      <h1>Memory</h1>
      {!isGameOn && !isError && (
        <Form
          handleSubmit={startGame}
          handleChange={handleFormChange}
          isFirstRender={isFirstRender}
        />
      )}
      {isGameOn && !areAllCardsMatched && (
        <AssistiveTechInfo
          emojisData={emojisData}
          matchedCards={matchedCards}
        />
      )}
      {areAllCardsMatched && <GameOver handleClick={resetGame} />}
      {isGameOn && (
        <MemoryCard
          handleClick={turnCard}
          data={emojisData}
          selectedCards={selectedCards}
          matchedCards={matchedCards}
        />
      )}
      {isError && <ErrorCard handleClick={resetError} />}
    </main>
  );
}
