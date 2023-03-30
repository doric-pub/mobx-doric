package pub.doric.library;

import pub.doric.DoricComponent;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;
import pub.doric.utils.DoricUtils;

@DoricComponent
public class DoricMobxLibrary extends DoricLibrary {
    @Override
    public void load(DoricRegistry registry) {
        {
            String content = DoricUtils.readAssetBinFile("bundle_mobx-doric.js");
            registry.registerJSBundle("mobx-doric", content);
        }
        {
            String content = DoricUtils.readAssetBinFile("bundle_mobx.js");
            registry.registerJSBundle("mobx", content);
        }
    }
}
