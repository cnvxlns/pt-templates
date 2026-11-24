import { createRoot } from "react-dom/client";
import { decks, findDeck } from "./decks/registry";
import "./styles/stage.css";
import "./styles/pulse.css";
import "./styles/index.css";

const slug = new URLSearchParams(window.location.search).get("deck");
const Deck = slug ? findDeck(slug)?.Deck : undefined;

createRoot(document.getElementById("root")!).render(
  Deck ? <Deck /> : (
    <main className="pulse-index">
      <header>
        <span className="pulse-brand">PULSE</span>
        <h1>알고리즘 스터디 발표자료</h1>
      </header>
      {slug && <p role="status">요청한 덱을 찾을 수 없습니다.</p>}
      <ul>
        {decks.map((deck) => (
          <li key={deck.slug}>
            <a href={`?deck=${encodeURIComponent(deck.slug)}`}>
              <strong>{deck.title}</strong>
              <span>{deck.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  ),
);
