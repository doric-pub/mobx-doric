#import "DoricMobxLibrary.h"

@implementation DoricMobxLibrary
- (void)load:(DoricRegistry *)registry {
    NSString *path = [[NSBundle mainBundle] bundlePath];
    {
        NSString *fullPath = [path stringByAppendingPathComponent:@"bundle_mobx-doric.js"];
        NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
        [registry registerJSBundle:jsContent withName:@"mobx-doric"];
    }
    {
        NSString *fullPath = [path stringByAppendingPathComponent:@"bundle_mobx.js"];
        NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
        [registry registerJSBundle:jsContent withName:@"mobx"];
    }
}
@end
