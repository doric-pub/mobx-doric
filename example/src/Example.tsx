import { Text, Group, Panel, VLayout, layoutConfig, Gravity, jsx } from "doric";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-doric";

class Ticker {
  constructor() {
    makeObservable(this);
  }

  @observable tick = 0;

  @action.bound
  increase() {
    this.tick++;
  }
}

@Entry
export class CounterPanel extends Panel {
  ticker = new Ticker();
  build(root: Group) {
    <VLayout
      parent={root}
      layoutConfig={layoutConfig().most()}
      gravity={Gravity.Center}
      space={20}
    >
      {observer(() => (
        <Text textSize={40}>{`${this.ticker.tick}`}</Text>
      ))}
      <Text textSize={20} onClick={this.ticker.increase}>
        Increase
      </Text>
    </VLayout>;
  }
}
