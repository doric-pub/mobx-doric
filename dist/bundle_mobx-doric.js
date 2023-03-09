'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var doric = require('doric');
var mobx = require('mobx');

function combineView(oldV, newV) {
    if (oldV.viewType() !== newV.viewType()) {
        throw new Error("View type should be the same");
    }
    for (let key in newV) {
        let toSet = key !== "viewId" &&
            key !== "__dirty_props__" &&
            key !== "callbacks" &&
            key !== "nativeViewModel" &&
            key !== "children";
        if (newV instanceof doric.Refreshable) {
            toSet = toSet && key !== "content" && key !== "header";
        }
        else if (newV instanceof doric.Scroller) {
            toSet = toSet && key !== "content";
        }
        if (toSet) {
            const v = Reflect.get(newV, key, newV);
            if (!(v instanceof Function)) {
                Reflect.set(oldV, key, v, oldV);
                if (key === "_ref") {
                    oldV.ref = v;
                }
            }
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
    else if (newV instanceof doric.Refreshable) {
        if (!(oldV instanceof doric.Refreshable)) {
            throw new Error("View type should be the same");
        }
        if (oldV.header && newV.header) {
            combineView(oldV.header, newV.header);
        }
        else {
            oldV.header = newV.header;
        }
        combineView(oldV.content, newV.content);
    }
    else if (newV instanceof doric.Scroller) {
        if (!(oldV instanceof doric.Scroller)) {
            throw new Error("View type should be the same");
        }
        combineView(oldV.content, newV.content);
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
    if (!v) {
        v = f();
        Promise.resolve().then(() => {
            mobx.autorun(() => {
                const nv = f();
                if (!!!v) {
                    v = nv;
                    return;
                }
                combineView(v, nv);
            });
        });
    }
    return v;
}

exports.observer = observer;
//# sourceMappingURL=bundle_mobx-doric.js.map
