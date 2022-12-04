'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {FilterLineByInputString} from './filter_inputstring';
import {FilterLineByInputRegex} from './filter_inputregex';
import {FilterLineByConfigFile} from './filter_configfile';
import {FilterVersion} from './filter_version';
import {FilterByDevice} from './filter_device';
import {FilterGeneral} from './filter_general';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "uSDKLogFilter" is now active!');


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableFilterby = vscode.commands.registerCommand('extension.uSDKLogFilterBy', async (fileUri) => {
        let path: string | undefined;
        if (typeof fileUri !== 'undefined' && !(fileUri instanceof vscode.Uri)) {
            console.warn('File URI validation failed');
            return;
        }
        path = (fileUri) ? fileUri.fsPath : undefined;

        interface Filters {
            label: string;
            command: string;
        }

        const filters: Array<Filters> = [
            {label: 'Input String', command: 'extension.uSDKLogFilterByInputString'},
            {label: 'Input Regex', command: 'extension.uSDKLogFilterByInputRegex'},
            {label: 'Not Contain Input String', command: 'extension.uSDKLogFilterByNotContainInputString'},
            {label: 'Not Match Input Regex', command: 'extension.uSDKLogFilterByNotMatchInputRegex'},
            {label: 'Config File', command: 'extension.uSDKLogFilterByConfigFile'}];

        const choices: vscode.QuickPickItem[] = filters.map(item => Object.create({label: item.label}));
        let choice: string | vscode.QuickPickItem | undefined = await vscode.window.showQuickPick(choices);
        if (choice === undefined) {
            return;
        } else {
            choice = choice.label;
        }
        await vscode.commands.executeCommand(filters.filter(val => val.label === choice)[0].command, path);
    });

    let disposableInputstring = vscode.commands.registerCommand('extension.uSDKLogFilterByInputString', (path) => {
        let filter = new FilterLineByInputString(context);
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableInputregex = vscode.commands.registerCommand('extension.uSDKLogFilterByInputRegex', (path) => {
        let filter = new FilterLineByInputRegex(context);
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableNotcontaininputstring = vscode.commands.registerCommand('extension.uSDKLogFilterByNotContainInputString', (path) => {
        let filter = new FilterLineByInputString(context);
        filter.notcontain = true;
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableNotmatchinputregex = vscode.commands.registerCommand('extension.uSDKLogFilterByNotMatchInputRegex', (path) => {
        let filter = new FilterLineByInputRegex(context);
        filter.notmatch = true;
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableConfigfile = vscode.commands.registerCommand('extension.uSDKLogFilterByConfigFile', (path) => {
        let filter = new FilterLineByConfigFile(context);
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableVersion = vscode.commands.registerCommand('extension.uSDKLogFilterByVersion', (path) => {
        let filter = new FilterVersion(context);
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableDevice = vscode.commands.registerCommand('extension.uSDKLogFilterByDevice', (path) => {
        let filter = new FilterByDevice(context);
        filter.filter(path);
        context.subscriptions.push(filter);
    });

    let disposableGeneral = vscode.commands.registerCommand('extension.uSDKLogFilterByTrace', (path) => {

        let picks: Array<string> = ['All', 
                                    '绑定(bId = bind)',
                                    '控制(bId = opack)'];
        vscode.window.showQuickPick(picks).then(value => {
            if (value === undefined || value.length === 0) {
                console.log('No selected');                
                return;
            }

            console.log('select:' + value );

            const index = picks.indexOf(value);
            let regex: Array<RegExp> = [];
            if (index === 0) {
                regex.push(new RegExp('uTraceImp.m'));
            } else if (index === 1) {
                regex.push(new RegExp('uTraceImp.m.*bId = bind'));
            } else if (index === 2) {
                regex.push(new RegExp('uTraceImp.m.*bId = opack'));
            } else {

            }

            let filter = new FilterGeneral(context, regex);
            filter.filter(path);
            context.subscriptions.push(filter);
        });
    });

    context.subscriptions.push(disposableFilterby);
    context.subscriptions.push(disposableInputstring);
    context.subscriptions.push(disposableInputregex);
    context.subscriptions.push(disposableNotcontaininputstring);
    context.subscriptions.push(disposableNotmatchinputregex);
    context.subscriptions.push(disposableConfigfile);
    context.subscriptions.push(disposableVersion);
    context.subscriptions.push(disposableDevice);
    context.subscriptions.push(disposableGeneral);

    registerCommandSoftAp(context);
    registerCommandVideo(context);
    registerCommandBLE(context);

}

function registerCommandSoftAp(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.uSDKLogFilterBySoftAp', (path) => {

        let pickLabels = ['uSDKBinding',
                        'uSDKSoftApBinding',
                        'uSDKSoftApConfig',
                        'uSDKNetworkReachabilityManager',
                        // 'cloud_get_device_bind_result',
                        // 'uSDKHttpsHALInterface',
                        'getBindResult'];

        let regexArray = [new RegExp('uSDKBinding'),
                        new RegExp('uSDKSoftApBinding'),
                        new RegExp('uSDKSoftApConfig'),
                        new RegExp('uSDKNetworkReachabilityManager'),
                        // new RegExp('cloud_get_device_bind_result'),
                        // new RegExp('uSDKHttpsHALInterface'),
                        new RegExp('((getNewUWSRequestWithDetailURL|sendHttpRequest2).*dcs/device-service-2c/get/device/binding/status)|uSDKHttpsHALInterface|((uSDKCommandPackage|uSDKCommunication).*cloud_get_device_bind_result)')];


        vscode.window.showQuickPick(pickLabels, {canPickMany: true}).then(values => {
            if (values === undefined || values.length === 0) {
                console.log('No selected');
                return;
            }

            let selectedRegexs: Array<RegExp> = values.map(item => {
                const index = pickLabels.indexOf(item);
                return regexArray[index];
            });

            let filter = new FilterGeneral(context, selectedRegexs);
            filter.filter(path);
            context.subscriptions.push(filter);
        });

    });

    context.subscriptions.push(disposable);

}

function registerCommandVideo(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.uSDKLogFilterByVideo', (path) => {

        let pickLabels = ['uSDKVideo',
                        'uSDKPlaybackPlayer',
                        'uSDKMonitorPlayer',
                        'uSDKCloudManager',
                        'uSDKVideoManager',
                        'uSDKPlayer+uSDKPrivatePlayer'];

        let regexArray = [new RegExp('uSDKVideo'),
                        new RegExp('uSDKPlaybackPlayer'),
                        new RegExp('uSDKMonitorPlayer'),
                        new RegExp('uSDKCloudManager'),
                        new RegExp('uSDKVideoManager'),
                        new RegExp('uSDKPlayer\\+uSDKPrivatePlayer')];


        vscode.window.showQuickPick(pickLabels, {canPickMany: true}).then(values => {
            if (values === undefined || values.length === 0) {
                console.log('No selected');
                return;
            }

            let selectedRegexs: Array<RegExp> = values.map(item => {
                const index = pickLabels.indexOf(item);
                return regexArray[index];
            });

            let filter = new FilterGeneral(context, selectedRegexs);
            filter.filter(path);
            context.subscriptions.push(filter);
        });

    });

    context.subscriptions.push(disposable);

}

/**
 * WiFi&BLE绑定分析
 * 1. 最好能有设备前后广播内容变化及解析【todo】
 * 2. 先实现V5
 * 3. 要包含mqtt，BLE HAL，json
 * 
 */
function registerCommandBLE(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.uSDKLogFilterByBLE', (path) => {

        let pickLabels = ['uSDKBinding',
                        'uSDKBLEBinding',
                        'uSDKWiFiBLEBinding',
                        'uSDKNetworkReachabilityManager',
                        //'uSDKBLEHALInterface',
                        'getBindResult'];

        let regexArray = [new RegExp('uSDKBinding'),
                        new RegExp('uSDKBLEBinding'),
                        new RegExp('uSDKWiFiBLEBinding|((uSDKCommandPackage|uSDKCommunication).*(config_device_by_ble|module_config_state_notify|ucom_config_state_notify))'),
                        new RegExp('uSDKNetworkReachabilityManager'),
                        //new RegExp('uSDKHttpsHALInterface'),
                        new RegExp('((getNewUWSRequestWithDetailURL|sendHttpRequest2).*dcs/device-service-2c/get/device/binding/status)|((proxy up.*queryDevBindStatus)|(come topic.*queryDevBindStatus))|((uSDKCommandPackage|uSDKCommunication).*cloud_get_device_bind_result)')];


        vscode.window.showQuickPick(pickLabels, {canPickMany: true}).then(values => {
            if (values === undefined || values.length === 0) {
                console.log('No selected');
                return;
            }

            let selectedRegexs: Array<RegExp> = values.map(item => {
                const index = pickLabels.indexOf(item);
                return regexArray[index];
            });

            let filter = new FilterGeneral(context, selectedRegexs);
            filter.filter(path);
            context.subscriptions.push(filter);
        });

    });

    context.subscriptions.push(disposable);

}


// this method is called when your extension is deactivated
export function deactivate() {
}
