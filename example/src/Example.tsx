import {
  Text,
  List,
  Group,
  Panel,
  layoutConfig,
  Gravity,
  jsx,
  HLayout,
  Stack,
  ListItem,
  Color,
  modal,
  GestureContainer,
  createRef,
} from "doric";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-doric";

interface ToDoItem {
  title: string;
  checked: boolean;
  deadline: number;
}

class ToDoList {
  constructor() {
    makeObservable(this);
  }

  @observable todos: ToDoItem[] = [];

  @computed get allLength() {
    return this.todos.length;
  }

  @action.bound
  add(todo: ToDoItem) {
    this.todos.push(todo);
  }
}

function AddButton(props: { onClick?: () => void }) {
  const textRef = createRef<Text>();
  return (
    <GestureContainer
      onTouchDown={() => {
        textRef.current.backgroundColor = Color.parse("#2980b9");
      }}
      onTouchCancel={() => {
        textRef.current.backgroundColor = Color.parse("#3498db");
      }}
      onTouchUp={() => {
        textRef.current.backgroundColor = Color.parse("#3498db");
      }}
      onSingleTap={props.onClick}
      layoutConfig={layoutConfig()
        .fit()
        .configAlignment(Gravity.Right.bottom())
        .configMargin({ bottom: 30, right: 30 })}
    >
      <Text
        ref={textRef}
        width={50}
        layoutConfig={layoutConfig().just()}
        height={50}
        corners={25}
        backgroundColor={Color.parse("#3498db")}
        textColor={Color.WHITE}
        textSize={30}
        textAlignment={Gravity.Center}
      >
        +
      </Text>
    </GestureContainer>
  );
}

function ToDoCell(props: { item: ToDoItem }) {
  return observer(() => (
    <ListItem layoutConfig={layoutConfig().mostWidth().fitHeight()}>
      <HLayout
        layoutConfig={layoutConfig()
          .mostWidth()
          .justHeight()
          .configMargin({ bottom: 1 })}
        height={50}
        gravity={Gravity.CenterY}
        backgroundColor={
          props.item.checked ? Color.parse("#2ecc71") : Color.parse("#e67e22")
        }
        onClick={() => {
          props.item.checked = true;
        }}
        padding={{ left: 20, right: 20 }}
      >
        <Text textSize={20} textColor={Color.WHITE}>
          {`${props.item.checked ? "☑︎" : "☐"}\t${props.item.title}`}
        </Text>
      </HLayout>
    </ListItem>
  ));
}

@Entry
export class ToDoListPanel extends Panel {
  todos = new ToDoList();
  build(root: Group) {
    <Stack layoutConfig={layoutConfig().most()} parent={root}>
      {observer(() => (
        <List
          layoutConfig={layoutConfig().most()}
          itemCount={this.todos.allLength}
          renderItem={(idx) =>
            (<ToDoCell item={this.todos.todos[idx]} />) as ListItem
          }
        />
      ))}
      <AddButton
        onClick={async () => {
          const text = await modal(this.context).prompt({
            title: "Please input todo",
          });
          this.todos.add({
            title: text,
            checked: false,
            deadline: 0,
          });
        }}
      />
    </Stack>;
  }
}
