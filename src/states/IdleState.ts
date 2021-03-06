import State from "./State";
import { EVENTS, STATE_TYPE } from "../consts";
import { FlickingContext } from "../types";

class IdleState extends State {
  public readonly type = STATE_TYPE.IDLE;
  public readonly holding = false;
  public readonly playing = false;

  public onEnter() {
    this.direction = null;
    this.targetPanel = null;
    this.delta = 0;
    this.lastPosition = 0;
  }

  public onHold(e: any, { flicking, viewport, triggerEvent, transitTo }: FlickingContext): void {
    // Shouldn't do any action until any panels on flicking area
    if (flicking.getPanelCount() <= 0) {
      transitTo(STATE_TYPE.DISABLED);
      return;
    }

    this.lastPosition = viewport.getCameraPosition();
    triggerEvent(EVENTS.HOLD_START, e, true)
      .onSuccess(() => {
        transitTo(STATE_TYPE.HOLDING);
      })
      .onStopped(() => {
        transitTo(STATE_TYPE.DISABLED);
      });
  }

  // By methods call
  public onChange(e: any, context: FlickingContext): void {
    const { triggerEvent, transitTo } = context;

    triggerEvent(EVENTS.MOVE_START, e, false)
      .onSuccess(() => {
        // Trigger AnimatingState's onChange, to trigger "move" event immediately
        transitTo(STATE_TYPE.ANIMATING)
          .onChange(e, context);
      })
      .onStopped(() => {
        transitTo(STATE_TYPE.DISABLED);
      });
  }
}

export default IdleState;
