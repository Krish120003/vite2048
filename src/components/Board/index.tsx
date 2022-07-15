import { useReducer, useEffect } from "preact/hooks";
import { CellGrid, CellValue } from "./types";
import { mergeLeftAndInsert, rotate, isGameOver, didWin } from "./logic";

const initialGrid: CellGrid = [
  [2, 0, 2, 2],
  [0, 0, 0, 0],
  [0, 0, 2, 0],
  [2, 2, 4, 8],
];

interface GameState {
  grid: CellGrid;
  win: boolean;
  over: boolean;
}

function reducer(
  { grid, win, over }: GameState,
  { key: action }: { key: string }
): GameState {
  // console.log(action);

  switch (action) {
    case "ArrowLeft":
      console.log("left");
      grid = mergeLeftAndInsert(grid);
      break;
    case "ArrowRight":
      console.log("right");
      grid = rotate(rotate(mergeLeftAndInsert(rotate(rotate(grid)))));
      break;
    case "ArrowDown":
      console.log("down");
      grid = rotate(rotate(rotate(mergeLeftAndInsert(rotate(grid)))));
      break;
    case "ArrowUp":
      console.log("up");
      grid = rotate(mergeLeftAndInsert(rotate(rotate(rotate(grid)))));
      break;
  }

  win = didWin(grid);
  over = isGameOver(grid);

  return { grid, win, over };
}

export default function index(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    grid: initialGrid,
    win: false,
    over: false,
  });

  useEffect(() => {
    const listener = document.addEventListener("keydown", dispatch);

    return () => {
      document.removeEventListener("keydown", dispatch);
    };
  }, []);

  return (
    <div class="bg-blue-300 p-6 aspect-square grid gap-4 grid-cols-4 grid-rows-4 rounded-xl">
      {state.grid.map((row: Array<CellValue>, id: number) => (
        <>
          {row.map((cellValue: CellValue, id2: number) => (
            <div
              class="bg-blue-100 aspect-square w-[8rem] text-4xl font-black flex justify-center items-center rounded-md"
              key={id.toString() + id2.toString()}
            >
              <p>{cellValue === 0 ? "" : cellValue}</p>
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
