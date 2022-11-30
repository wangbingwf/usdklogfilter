'use strict';
import { format } from 'path';
import * as vscode from 'vscode';
import { FilterLineBase } from './filter_base';

class FilterByDevice extends FilterLineBase {
    private _inputstring?: string;
    private _modulesRegex: Array<RegExp> = [];


    constructor(context: vscode.ExtensionContext) {
        super(context);


    }

    protected getRegExps(modules:Array<string>): Array<RegExp> {
        let regExps: Array<RegExp> = [];
        modules.forEach(element => {
            if (element === 'uSDK') {
                let reg = new RegExp('Phone .*' + this._inputstring);
                regExps.push(reg);
            }

            if (element === 'UCOM') {
                let reg = new RegExp('\\[UCOM\\].*' + this._inputstring);
                regExps.push(reg);
            }

            if (element === 'CAE') {
                let reg = new RegExp('\\[CAE\\].*' + this._inputstring);
                regExps.push(reg);
            }

        });

        return regExps;
    }


    protected async prepare(callback : (succeed: boolean)=>void){
        const makeInputStr = (text: string | undefined) => {
            if(text === undefined || text === ''){
                console.log('No input');
                callback(false);
                return;
            }

            console.log('input : ' + text);
            this._inputstring = text;

            let picks: Array<string> = ['uSDK', 'UCOM', 'CAE'];
            vscode.window.showQuickPick(picks, {canPickMany:true}).then(values => {

                if (values === undefined || values.length === 0) {
                    console.log('No selected');
                    callback(false);
                    return;
                }

                console.log('selected:' + values.toString());
                this._modulesRegex = this.getRegExps(values);
                callback(true);
            });

        };

        vscode.window.showInputBox({prompt: 'Enter the deviceID'}).then(makeInputStr);

    }

    protected matchLine(line: string): string | undefined{
        for (const regex of this._modulesRegex) {
             if (line.match(regex) !== null) {
                return line;
             }
        }

        return undefined;
    }

    dispose(){
    }

}

export { FilterByDevice};