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

### uSDKLogFilter By Device

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By Device`
3. 弹出输入框，输入要过滤的设备ID
4. 弹出多选列表，支持按uSDK，UCOM，CAE进行过滤
5. 点击确定，插件会将选择的模块日志中包含该设备ID的日志过滤出来

### uSDKLogFilter By Trace

1. 打开要过滤的日志文件
2. 打开命令模式 (⇧⌘P)，输入 `uSDKLogFilter`, 选择 `uSDKLogFilter By Trace`
3. 弹出单选列表，支持All，bId = bind, bId = opack进行过滤
4. 点击确定，插件会将过滤后的日志显示出来

**Enjoy!**
