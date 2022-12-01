'use strict';
import * as vscode from 'vscode';
import {FilterLineBase} from './filter_base';

/**
 * 1. 通用过滤文件
 * 2. 可以指定字符串过滤方式
 * 3. 可以指定正则过滤方式
 * 4. 外部直接指定具体的内容，如：
 *  4.1 指定只显示trace，则可以添加具体的命令，在extension中具体命令执行时，初始化具体的过滤条件，调用该文件即可
 */

class FilterGeneral extends FilterLineBase{
    public regex: Array<RegExp>;

    constructor(context: vscode.ExtensionContext, regex: RegExp[]) {
        super(context);

        this.regex = regex;
    }

    protected async prepare(callback : (succeed: boolean)=>void){
        callback(true);

    }

    protected matchLine(line: string): string | undefined{

        for (const reg of this.regex) {
            if (line.match(reg) !== null) {
               return line;
            }
        }

        return undefined;
    }

    dispose(){
    }
}

export { FilterGeneral};
