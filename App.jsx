import { useState } from "react";
import Form from "/components/Form";
import MemoryCard from "/components/MemoryCard";

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojisData, setEmojisData] = useState([]);

  console.log({ emojisData });

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

      setEmojisData(dataSlice);
      setIsGameOn(true);
    } catch (error) {
      console.error(error);
    }
  }

  function turnCard() {
    console.log("Memory card clicked");
  }

  function getDataSlice(data) {
    const randomIndices = getRandomIndices(data);

    const dataSlice = randomIndices.map((index) => data[index]);
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

  return (
    <main>
      <h1>Memory</h1>
      {!isGameOn && <Form handleSubmit={startGame} />}
      {isGameOn && <MemoryCard handleClick={turnCard} data={emojisData} />}
    </main>
  );
}
