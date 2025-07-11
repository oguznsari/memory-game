import { decodeEntity } from "html-entities";
import EmojiButton from "./EmojiButton";

export default function MemoryCard({ handleClick, data }) {
  const cardEl = data.map((emoji, index) => (
    <li key={index} className="card-item">
      <EmojiButton
        content={decodeEntity(emoji.htmlCode[0])}
        style="btn btn--emoji"
        handleClick={() => handleClick(emoji.name, index)}
      />
    </li>
  ));

  return <ul className="card-container">{cardEl}</ul>;
}
