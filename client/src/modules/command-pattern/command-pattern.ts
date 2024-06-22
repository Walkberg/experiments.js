import { CSSProperties, Dispatch } from "react";

export abstract class Command<T> {
  utils: T;

  constructor(utils: T) {
    this.utils = utils;
  }

  abstract execute(): Promise<void>;

  abstract undo(): Promise<void>;

  abstract getInfo(): string;
}

export interface CommandUtils {
  styles: CSSProperties;
  setStyles: Dispatch<React.SetStateAction<CSSProperties>>;
}

export class BoldCommand<T extends CommandUtils> extends Command<T> {
  prevFontWeight?: CSSProperties["fontWeight"];

  constructor(utils: T) {
    super(utils);
    this.prevFontWeight = utils.styles.fontWeight;
  }

  getNextStyle() {
    if (
      this.prevFontWeight === "bold" ||
      (typeof this.prevFontWeight === "number" && this.prevFontWeight >= 700)
    ) {
      return "normal";
    }
    return "bold";
  }

  async execute() {
    const nextFontStyle = this.getNextStyle();
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      fontWeight: nextFontStyle,
    }));
  }

  async undo() {
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      fontWeight: this.prevFontWeight,
    }));
  }

  getInfo() {
    return "Bold Command : Change into " + this.getNextStyle();
  }
}

export class ItalicCommand<T extends CommandUtils> extends Command<T> {
  prevFontStyle?: CSSProperties["fontStyle"];

  constructor(utils: T) {
    super(utils);
    this.prevFontStyle = utils.styles.fontStyle;
  }

  getNextStyle() {
    if (
      this.prevFontStyle === "oblique" ||
      (typeof this.prevFontStyle === "number" && this.prevFontStyle >= 700)
    ) {
      return "normal";
    }
    return "oblique";
  }

  async execute() {
    const nextFontStyle = this.getNextStyle();
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      fontStyle: nextFontStyle,
    }));
  }

  async undo() {
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      fontStyle: this.prevFontStyle,
    }));
  }

  getInfo() {
    return "Italic Command : Change into " + this.getNextStyle();
  }
}

export class UnderlineCommand<T extends CommandUtils> extends Command<T> {
  prevFontDecoration?: CSSProperties["textDecoration"];

  constructor(utils: T) {
    super(utils);
    this.prevFontDecoration = utils.styles.textDecoration;
  }

  getNextStyle() {
    if (
      this.prevFontDecoration === "underline" ||
      (typeof this.prevFontDecoration === "number" &&
        this.prevFontDecoration >= 700)
    ) {
      return "none";
    }
    return "underline";
  }

  async execute() {
    const nextFontStyle = this.getNextStyle();
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      textDecoration: nextFontStyle,
    }));
  }

  async undo() {
    this.utils.setStyles((prevStyles) => ({
      ...prevStyles,
      textDecoration: this.prevFontDecoration,
    }));
  }

  getInfo() {
    return "Underline Command : Change into " + this.getNextStyle();
  }
}
