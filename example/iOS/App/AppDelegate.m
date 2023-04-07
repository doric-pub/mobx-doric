#import "AppDelegate.h"
#import <DoricCore/Doric.h>
#if __has_include(<SDWebImage/SDWebImage.h>)
#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>
#endif

#import <DoricCore/Doric.h>
#import "DoricMobxLibrary.h"

@interface AppDelegate ()
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
#if __has_include(<SDWebImage/SDWebImage.h>)
    [SDImageCodersManager.sharedManager addCoder:SDImageWebPCoder.sharedCoder];
#endif
    if (@available(iOS 13.0, *)) {
        // 在SceneDelegate里创建UIWindow
    } else {
        self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
        
        [Doric registerLibrary:[DoricMobxLibrary new]];
        NSString *bundleName = @"Example";
        DoricViewController *doricViewController = [[DoricViewController alloc] initWithSource:[NSString stringWithFormat:@"assets://src/%@.js", bundleName] alias:bundleName extra:@""];
        doricViewController.view.backgroundColor = [UIColor whiteColor];
    #if DEBUG
        UIBarButtonItem *rightBarItem = [[UIBarButtonItem alloc] initWithTitle:@"Devkit" style:UIBarButtonItemStylePlain target:self action:@selector(onOpenDevkit)];
        doricViewController.navigationItem.rightBarButtonItem = rightBarItem;
    #endif
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:doricViewController];
        
        [self.window setRootViewController:navigationController];
        [self.window makeKeyAndVisible];
    }
    return YES;
}


#pragma mark - UISceneSession lifecycle


- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    // Called when a new scene session is being created.
    // Use this method to select a configuration to create the new scene with.
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}


- (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
    // Called when the user discards a scene session.
    // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
    // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
}


@end
