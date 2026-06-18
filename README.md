# Word Ladder

A minimal React + Tailwind word puzzle game with two tabs:

- **Play** — random Start/Target puzzle; transform one into the other by changing exactly one letter per step. A background BFS computes the optimal "par" path and reveals it on win.
- **Solver** — type any two 4-letter dictionary words and BFS returns the absolute shortest ladder between them.

## Stack

- **React 18** (functional components + hooks)
- **Tailwind CSS 3**
- **Vite** (dev server + build)

## File layout (minimal)

```
word-ladder/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx       # Everything: dictionary, BFS, both tabs, all UI
    ├── index.css     # Tailwind directives
    └── main.jsx      # React entrypoint
```

The entire app lives in `src/App.jsx`, organized in numbered sections:

1. Dictionary (~2,200 common 4-letter words; proper nouns excluded)
2. Word graph + BFS (wildcard-bucket adjacency, O(N·L) construction)
3. Shared UI primitives (`WordTile`, `LadderRung`, `LetterInput`)
4. **Play tab** (game logic + Success panel)
5. **Solver tab** (user-supplied start/target → shortest path)
6. Root `App` with the tab switcher

## Run locally

```bash
cd word-ladder
npm install
npm run dev
```

Open the URL shown in your terminal (typically http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```
