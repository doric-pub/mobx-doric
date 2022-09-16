import { Group, View } from "doric";

import { autorun } from "mobx";

function combineView(oldV: View, newV: View) {
  if (oldV.viewType() !== newV.viewType()) {
    throw new Error("View type should be the same");
  }
  for (let key in newV) {
    if (
      key !== "viewId" &&
      key !== "__dirty_props__" &&
      key !== "callbacks" &&
      key !== "nativeViewModel" &&
      key !== "children"
    ) {
      {
        const v = Reflect.get(newV, key, newV);
        Reflect.set(oldV, key, v, oldV);
        if (key === "_ref") {
          oldV.ref = v;
        }
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
  return v as View | JSX.Element;
}
