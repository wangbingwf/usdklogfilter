'use strict';
import { format } from 'path';
import * as vscode from 'vscode';
import { FilterLineBase } from './filter_base';

class FilterVersion extends FilterLineBase {
    // private _inputstring?: string;
    // private readonly HIST_KEY = 'inputStr';

    // public notcontain: boolean = false;

    private _usdkdone: boolean = false;
    private _ucomdone: boolean = false;
    private _caedone: boolean = false;
    private _ussdone: boolean = false;
    private _eppdone: boolean = false;


    private _filters: Array<string> = [
        'uSDK ClientVersion',
        'src ver',
        'uss version',
        'parser version',
        'sdk_module_manager_init:84][S]',
    ];

    constructor(context: vscode.ExtensionContext) {
        super(context);

    }

    protected async prepare(callback : (succeed: boolean)=>void){

        callback(true);
    }

    protected matchLine(line: string): string | undefined{

        /**
         *     private _filters: Array<string> = [
        'uSDK ClientVersion',
        'src ver',
        'uss version',
        'parser version',
        'sdk_module_manager_init:84][S]',
    ];
         * 
         */

        //uSDK版本号
        const usdkversionkey:string = 'uSDK ClientVersion:';
        let index : number = line.indexOf(usdkversionkey);
        if (this._usdkdone === false && index !== -1) {

            this._usdkdone = true;
            return `uSDK Version    ${line.substring(index + usdkversionkey.length, line.length - 1)}`;
        }

        //UCOM版本号
        index = line.indexOf('][sdk_module_manager_init');
        if (this._ucomdone === false && index !== -1) {

            this._ucomdone = true;
            const lastIndex = line.lastIndexOf('[', index);
            return `UCOM Version    ${line.substring(lastIndex + 1, index)}`;
        }

        //CAE版本号
        const caeversionkey:string = 'src ver ';
        index = line.indexOf(caeversionkey);
        if (this._caedone === false && index !== -1) {

            this._caedone = true;
            return `CAE  Version    ${line.substring(index + caeversionkey.length)}`;
        }

        //USS版本号
        const ussversionkey:string = 'uss version:[';
        index = line.indexOf(ussversionkey);
        if (this._ussdone === false && index !== -1) {

            this._ussdone = true;
            return `USS  Version    ${line.substring(index + ussversionkey.length, line.length - 1)}`;
        } 
        
        //E++版本号
        const eppversionkey:string = 'parser version is ';
        index = line.indexOf(eppversionkey);
        if (this._eppdone === false && index !== -1) {

            this._eppdone = true;
            return `E++  Version    ${line.substring(index + eppversionkey.length)}`;
        }         


        return undefined;
    }

    dispose(){
    }

}

export { FilterVersion};