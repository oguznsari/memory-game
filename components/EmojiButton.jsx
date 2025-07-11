export default function EmojiButton({
  content,
  handleClick,
  selectedCardEntry,
  matchedCardEntry,
}) {
  const btnContent = selectedCardEntry || matchedCardEntry ? content : "?";

  return (
    <button className="btn btn--emoji" onClick={handleClick}>
      {btnContent}
    </button>
  );
}
