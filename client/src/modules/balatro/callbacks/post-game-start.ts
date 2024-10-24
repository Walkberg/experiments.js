import { CustomCallback } from "./mod-callback";

export class PostGameStart extends CustomCallback {
  constructor() {
    super();
  }

  protected override shouldNotify = () => true;
}
