import { useReducer, useEffect } from "preact/hooks";
import { CellGrid, CellValue } from "./types";
import {
  mergeLeftAndInsert,
  rotate,
  isGameOver,
  didWin,
  addRandom,
} from "./logic";

const initialGrid: CellGrid = addRandom(
  addRandom([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ])
);

interface GameState {
  grid: CellGrid;
  win: boolean;
  over: boolean;
}

interface CellColors {
  background: string;
  text: string;
}

const colors = {
  0: {
    background: "rgb(42, 72, 163)",
    text: "white",
  },
  2: {
    background: "rgb(0, 146 , 250)",
    text: "white",
  },
  4: {
    background: "rgb(0, 170 , 250)",
    text: "white",
  },
  8: {
    background: "rgb(0, 129, 250)",
    text: "",
  },
  16: {
    background: "rgb(0, 92, 250)",
    text: "",
  },
  32: {
    background: "rgb(0, 8, 250)",
    text: "",
  },
  64: {
    background: "rgb(87, 0, 250)",
    text: "",
  },
  128: {
    background: "rgb(117, 0, 250)",
    text: "",
  },
  256: {
    background: "rgb(88, 16, 161)",
    text: "",
  },
  512: {
    background: "rgb(163, 3, 137)",
    text: "",
  },
  1024: {
    background: "rgb(163, 3, 86)",
    text: "",
  },
  2048: {
    background: "rgb(163, 3, 38)",
    text: "",
  },
};

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
    <div class="bg-blue-900 p-6 aspect-square grid gap-4 grid-cols-4 grid-rows-4 rounded-xl">
      {state.grid.map((row: Array<CellValue>, id: number) => (
        <>
          {row.map((cellValue: CellValue, id2: number) => (
            <div
              key={id.toString() + id2.toString()}
              class="bg-blue-100 aspect-square w-[8rem] text-6xl text-white font-black flex justify-center items-center rounded-md select-none"
              style={{
                background: colors[cellValue].background,
              }}
            >
              <p>{cellValue === 0 ? "" : cellValue}</p>
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
