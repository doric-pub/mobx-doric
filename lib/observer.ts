import { Group, Refreshable, Scroller, View } from "doric";

import { autorun } from "mobx";

function combineView(oldV: View, newV: View) {
  if (oldV.viewType() !== newV.viewType()) {
    throw new Error("View type should be the same");
  }

  for (let key in newV) {
    let toSet =
      key !== "viewId" &&
      key !== "__dirty_props__" &&
      key !== "callbacks" &&
      key !== "nativeViewModel" &&
      key !== "children";
    if (newV instanceof Refreshable) {
      toSet = toSet && key !== "content" && key !== "header";
    } else if (newV instanceof Scroller) {
      toSet = toSet && key !== "content";
    }
    if (toSet) {
      const v = Reflect.get(newV, key, newV);
      Reflect.set(oldV, key, v, oldV);
      if (key === "_ref") {
        oldV.ref = v;
      }
    }
  }
  if (newV instanceof Group) {
    if (!(oldV instanceof Group)) {
      throw new Error("View type should be the same");
    }
    if (oldV.children.length !== newV.children.length) {
      oldV.removeAllChildren();
      newV.children.forEach((child) => oldV.addChild(child));
    } else {
      for (let i = 0; i < oldV.children.length; i++) {
        combineView(oldV.children[i], newV.children[i]);
      }
    }
  } else if (newV instanceof Refreshable) {
    if (!(oldV instanceof Refreshable)) {
      throw new Error("View type should be the same");
    }
    if (oldV.header && newV.header) {
      combineView(oldV.header, newV.header);
    } else {
      oldV.header = newV.header
    }
    combineView(oldV.content, newV.content);
  } else if (newV instanceof Scroller) {
    if (!(oldV instanceof Scroller)) {
      throw new Error("View type should be the same");
    }
    combineView(oldV.content, newV.content);
  }
}

export function observer(f: () => View | JSX.Element) {
  let v: any;
  autorun(() => {
    const nv = f();
    if (!!!v) {
      v = nv;
      return;
    }
    combineView(v, nv);
  });
  if (!v) {
    v = f();
    Promise.resolve().then(() => {
      autorun(() => {
        const nv = f();
        if (!!!v) {
          v = nv;
          return;
        }
        combineView(v, nv);
      });
    })
  }
  return v as View | JSX.Element;
}

export function Observer<T>(props: {
  innerElement: JSX.Element;
  onChange: (v: T) => void;
}) {
  const v = props.innerElement;
  autorun(() => {
    props.onChange(v as unknown as T);
  });
  return v;
}