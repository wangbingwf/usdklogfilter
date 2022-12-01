# usdklogfilter README

uSDK日志过滤

## Features

1. 基于vscode-extension-filter-line插件进行改造
2. 去掉了原插件的右键功能，by ConfigFile, by...功能
3. 新增部分uSDK日志过滤专用功能，具体见Usage

## Usage

### uSDKLogFilter By Version

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By Version`
3. 插件会将各个模块版本号过滤出来并展示到新的文件中

![version](img/version.gif)

### uSDKLogFilter By Device

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By Device`
3. 弹出输入框，输入要过滤的设备ID
4. 弹出多选列表，支持按uSDK，UCOM，CAE进行过滤
5. 点击确定，插件会将选择的模块日志中包含该设备ID的日志过滤出来

![device](img/device.gif)

### uSDKLogFilter By Trace

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By Trace`
3. 弹出单选列表，支持All，bId = bind, bId = opack进行过滤
4. 点击确定，插件会将过滤后的日志显示出来

![trace](img/trace.gif)

### uSDKLogFilter By SoftAp

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By SoftAp`
3. 弹出多选列表进行选择，如：
    3.1 只想看最外层结果，则选择uSDKBinding
    3.2 想看全部信息，则全部勾选
4. 点击确定，插件会将过滤后的日志显示出来
5. 该功能目前用户侧绑定的一些日志没有筛出来，待后续反馈进行增加优化

![softAp](img/softap.gif)

**Enjoy!**
