import {
  CSSProperties,
  Dispatch,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BoldCommand,
  Command,
  CommandUtils,
  ItalicCommand,
  UnderlineCommand,
} from "./command-pattern";
import { Button } from "@/components/ui/button";

export const CommandPatternPage = () => {
  const [styles, setStyles] = useState<CSSProperties>({});

  const utils = { styles, setStyles };

  const { executeCommand, redo, undo, histories } =
    useHistoryManager<CommandUtils>();

  const setTextToItalic = async () => {
    const italicCommand = new ItalicCommand(utils);
    await executeCommand(italicCommand);
  };

  const setTextToBold = async () => {
    const boldCommand = new BoldCommand(utils);
    await executeCommand(boldCommand);
  };

  const setTextToUnderline = async () => {
    const underlineCommand = new UnderlineCommand(utils);
    await executeCommand(underlineCommand);
  };

  return (
    <div>
      <div>
        <p style={styles}>Hello from react!</p>
        <div>
          <Button onClick={setTextToItalic} title="italic">
            <img src="/assets/format_italic.svg" alt="italic" />
          </Button>
          <Button onClick={setTextToBold} title="bold">
            <img src="/assets/format_bold.svg" alt="bold" />
          </Button>
          <Button onClick={setTextToUnderline} title="underline">
            <img src="/assets/format_underline.svg" alt="underline" />
          </Button>
          <Button onClick={undo} title="undo">
            <img src="/assets/undo.svg" alt="undo" />
          </Button>
          <Button onClick={redo} title="redo">
            <img src="/assets/redo.svg" alt="redo" />
          </Button>
        </div>
      </div>
      <div>
        <h2>History</h2>
        <ol>
          <li>
            <button>Initial</button>
          </li>
          {histories.map((history, index) => (
            <li key={index + history.type + history.message}>
              <button>{history.message}</button>
            </li>
          ))}
        </ol>
      </div>
      <TikTakToePage />
    </div>
  );
};

export const TikTakToePage = () => {
  const [client, setClient] = useState<TikTakToeClient>(
    new TikTakToeClientFake()
  );

  const handleClickTest = () => {
    setClient(new TikTakToeClientImpl());
  };

  return (
    <div>
      <TikTakToeProvider client={client}>
        <TikTakToe />
        <Button onClick={handleClickTest}>Test</Button>
      </TikTakToeProvider>
    </div>
  );
};

export const TikTakToe = () => {
  const { client } = useTiktakToe();

  const [myTurn, setMyTurn] = useState(false);
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );

  const { executeCommand, redo, undo, histories } =
    useHistoryManager<CommandUtilsTest>();

  const handleClick = (position: number) => {
    setMyTurn((a) => !a);

    const utils = {
      client,
      newPosIndex: position,
      squares: squares,
      setSquares,
      currentPlayer: myTurn,
    };

    executeCommand(new PlayCommand(utils));
  };

  return (
    <div>
      <div>
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </div>
      <div>
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
      </div>
      <div>
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </div>
      <div>
        <h2>History</h2>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <ol>
          <li>
            <button>Initial</button>
          </li>
          {histories.map((history, index) => (
            <li key={index + history.type + history.message}>
              <button>{history.message}</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export interface CommandUtilsTest {
  client: TikTakToeClient;
  currentPlayer: boolean;
  newPosIndex: number;
  squares: (string | null)[];
  setSquares: Dispatch<React.SetStateAction<(string | null)[]>>;
}

export class PlayCommand<T extends CommandUtilsTest> extends Command<T> {
  previousMoveIndex?: number;

  constructor(utils: T) {
    super(utils);
    this.previousMoveIndex = utils.newPosIndex;
  }

  async execute() {
    const nextSquares = this.utils.squares.slice();
    if (this.utils.currentPlayer) {
      nextSquares[this.utils.newPosIndex] = "X";
    } else {
      nextSquares[this.utils.newPosIndex] = "O";
    }
    await this.utils.client.updatePosition(this.utils.newPosIndex);
    this.utils.setSquares(nextSquares);
  }

  async undo() {
    if (this.previousMoveIndex === undefined) {
      return;
    }
    const nextSquares = this.utils.squares.slice();

    nextSquares[this.previousMoveIndex] = null;

    await this.utils.client.updatePosition(this.previousMoveIndex);

    this.utils.setSquares(nextSquares);
  }

  getInfo() {
    return `Move Command : Change into ${this.utils.newPosIndex}`;
  }
}

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

export const Square = ({ value, onClick }: SquareProps) => {
  return <Button onClick={onClick}>{value}</Button>;
};

function useHistoryManager<T>() {
  const [forwardHistory, setForwardHistory] = useState<Command<T>[]>([]);
  const [backHistory, setBackHistory] = useState<Command<T>[]>([]);

  const executeCommand = async (command: Command<T>) => {
    setForwardHistory([]);

    await command.execute();

    setBackHistory((prev) => [...prev, command]);
  };

  const redo = async () => {
    if (!forwardHistory.length) {
      return;
    }
    const topRedoCommand = forwardHistory[forwardHistory.length - 1];

    await topRedoCommand.execute();

    setForwardHistory((prev) => prev.slice(0, -1));
    setBackHistory((prev) => [...prev, topRedoCommand]);
  };

  const undo = async () => {
    if (!backHistory.length) {
      return;
    }
    const topUndoCommand = backHistory[backHistory.length - 1];

    await topUndoCommand.undo();

    setBackHistory((prev) => prev.slice(0, -1));
    setForwardHistory((prev) => [...prev, topUndoCommand]);
  };

  const histories = useMemo(() => {
    const formattedBackHistory = backHistory.map((command, index) => ({
      type: "undo",
      command,
      message: command.getInfo(),
    }));

    const formattedForwardHistory = [...forwardHistory]
      .reverse()
      .map((command, index) => ({
        type: "redo",
        command,
        message: command.getInfo(),
      }));

    return [...formattedBackHistory];
  }, [backHistory.length, forwardHistory.length]);

  return {
    executeCommand,
    redo,
    undo,
    histories,
  };
}

interface TokTakToeProviderProps {
  client: TikTakToeClient;
  children: React.ReactNode;
}

type TikTakToeState = {
  client: TikTakToeClient;
} | null;

const TikTakToeProviderContext = createContext<TikTakToeState>(null);

export function TikTakToeProvider({
  children,
  client,
}: TokTakToeProviderProps) {
  return (
    <TikTakToeProviderContext.Provider value={{ client }}>
      {children}
    </TikTakToeProviderContext.Provider>
  );
}

export function useTiktakToe() {
  const context = useContext(TikTakToeProviderContext);

  if (context == null) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}

export interface TikTakToeClient {
  updatePosition(newPos: number): Promise<void>;
}

export class TikTakToeClientFake implements TikTakToeClient {
  async updatePosition(newPos: number): Promise<void> {
    console.log("updatePosition fake", newPos);
  }
}

export class TikTakToeClientImpl implements TikTakToeClient {
  async updatePosition(newPos: number): Promise<void> {
    console.log("updatePosition impl", newPos);
  }
}
