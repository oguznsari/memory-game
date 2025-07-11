import { useState } from "react";
import Form from "/components/Form";
import MemoryCard from "/components/MemoryCard";

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);

  function startGame(e) {
    e.preventDefault();
    setIsGameOn(true);
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
