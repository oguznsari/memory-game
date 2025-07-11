import { useState } from "react";
import Form from "/components/Form";
import MemoryCard from "/components/MemoryCard";

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);

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
      console.log({ data });
      setIsGameOn(true);
    } catch (error) {
      console.error(error);
    }
  }

  function turnCard() {
    console.log("Memory card clicked");
  }

  return (
    <main>
      <h1>Memory</h1>
      {!isGameOn && <Form handleSubmit={startGame} />}
      {isGameOn && <MemoryCard handleClick={turnCard} />}
    </main>
  );
}
