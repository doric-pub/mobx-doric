'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var doric = require('doric');
var mobx = require('mobx');

function combineView(oldV, newV) {
    if (oldV.viewType() !== newV.viewType()) {
        throw new Error("View type should be the same");
    }
    for (let key in newV) {
        if (key !== "viewId" &&
            key !== "__dirty_props__" &&
            key !== "callbacks" &&
            key !== "nativeViewModel" &&
            key !== "children") {
            Reflect.set(oldV, key, Reflect.get(newV, key, newV), oldV);
        }
    }
    if (newV instanceof doric.Group) {
        if (!(oldV instanceof doric.Group)) {
            throw new Error("View type should be the same");
        }
        if (oldV.children.length !== newV.children.length) {
            oldV.removeAllChildren();
            newV.children.forEach((child) => oldV.addChild(child));
        }
        else {
            for (let i = 0; i < oldV.children.length; i++) {
                combineView(oldV.children[i], newV.children[i]);
            }
        }
    }
}
function observer(f) {
    let v;
    mobx.autorun(() => {
        const nv = f();
        if (!!!v) {
            v = nv;
            return;
        }
        combineView(v, nv);
    });
    return v;
}

exports.observer = observer;
//# sourceMappingURL=bundle_mobx-doric.js.map
