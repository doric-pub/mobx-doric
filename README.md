# mobx-doric
该库提供在Doric中使用状态管理工具mobx的方式支持

## 接入方式
您可以选择直接使用npm库,在打包时会将mobx编译进生成的bundle中, 或者依赖原生SDK后将mobx库提前内置进APP中.

直接使用npm库非常简单, 不过会显著增加bundle文件体积.而依赖原生SDK的方式虽然接入复杂,但不会增加bundle体积.
### 直接使用
1. 添加npm库依赖
```bash
npm install mobx-doric --save
```
2. 在doric工程的`rollup.config.js`中修改
```js
...
plugins: [
...
//mainFields字段修改为 jsnext:main
        resolve({ mainFields: ["jsnext:main"] }),
...
      ],
...
```
3. 正常引用mobx并打包

### 内置Android/iOS插件
1. 同上,添加npm库依赖
```bash
npm install mobx-doric --save
```
在rollup.config.js中修改
```javascript
//将"mobx-doric","mobx"加入external中
      external: ["reflect-metadata", "doric", "mobx-doric", "mobx"],
```
2. 添加Android依赖
  
  ```gradle
     implementation "pub.doric.extension:mobx:$version"
  ```
  ```java
  import pub.doric.library.DoricMobxLibrary;
  //初始化调用
     Doric.registerLibrary(new DoricMobxLibrary());
  ```
3. 添加iOS依赖

```ruby
  pod 'mobx-doric'
```
```objective-c
#import "DoricMobxLibrary.h"
  //初始化调用
    [Doric registerLibrary:[DoricMobxLibrary new]];
```

### 使用方式

```tsx

import { Text, Group, Panel, layoutConfig, Gravity, jsx, VLayout } from "doric";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-doric";

class Tick {
  @observable count = 0;
  constructor() {
    makeObservable(this);
  }
}

@Entry
export class Counter extends Panel {
  tick = new Tick();
  build(root: Group) {
    <VLayout
      parent={root}
      layoutConfig={layoutConfig().most()}
      gravity={Gravity.Center}
      space={20}
    >
    //用observer包装需更新的区域
      {observer(() => (
        <Text textSize={30}>{`${this.tick.count}`}</Text>
      ))}
      <Text
        textSize={30}
        onClick={() => {
          this.tick.count++;
        }}
      >
        Count
      </Text>
    </VLayout>;
  }
}
```
