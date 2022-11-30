'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class FilterLineBase{
    protected ctx: vscode.ExtensionContext;
    private history: any;
    protected readonly NEW_PATTERN_CHOISE = 'New pattern...';

    constructor(context: vscode.ExtensionContext) {
        this.ctx = context;

        this.history = this.ctx.globalState.get('history', {});
        console.log(`History: ${JSON.stringify(this.history)}`);
    }

    protected getHistory(): any {
        return this.history;
    }

    protected async updateHistory(hist: any) {
        this.history = hist;
        await this.ctx.globalState.update('history', hist);
    }

    protected getHistoryMaxSize(): number {
        return vscode.workspace.getConfiguration('uSDKLogFilter').get('historySize', 10);
    }

    protected async addToHistory(key: string, newEl: string) {
        if (this.history[key] === undefined) {
            console.warn(`History doesn't contain '${key}' field`);
            return;
        }

        if (this.history[key].indexOf(newEl) === -1) {
            const maxSz = this.getHistoryMaxSize();
            if (this.history[key].length >= maxSz) {
                for (let i = this.history[key].length; i > maxSz - 1; i--) {
                    this.history[key].pop();
                }
            }
            this.history[key].unshift(newEl);
            await this.ctx.globalState.update('history', this.history);
        }
    }

    protected async showHistoryPick(key: string) : Promise<string> {
        if (this.history[key] === undefined) {
            console.warn(`History doesn't contain '${key}' field`);
            return this.NEW_PATTERN_CHOISE;
        }

        let usrChoice: string | undefined = undefined;
        if (this.history[key].length) {
            let picks: Array<string> = [...this.history[key]];
            picks.push(this.NEW_PATTERN_CHOISE);
            usrChoice = await vscode.window.showQuickPick(picks);
        }
        return (usrChoice === undefined) ? this.NEW_PATTERN_CHOISE : usrChoice;
    }

    protected showInfo(text: string){
        console.log(text);
        vscode.window.showInformationMessage(text);
    }
    protected showError(text: string){
        vscode.window.showErrorMessage(text);
    }

    protected getDocumentPathToBeFilter(callback : (docPath: string)=>void, filePath_?: string){
        let filePath = filePath_;
        console.log('filepath = ' + filePath_);
        
        if (filePath_ === undefined) {
            let editor = vscode.window.activeTextEditor;
            if(!editor){
                this.showError('No file selected (Or file is too large. For how to filter large file, please visit README)');
                callback('');
                return;
            }

            let doc = editor.document;
            if(doc.isDirty){
                this.showError('Save before uSDKLogFilter');
                callback('');
                return;
            }

            filePath = doc.fileName;
        }

        if (filePath === undefined) {
            this.showError('Can not get valid file path');
            callback('');
            return;
        }

        const fs = require('fs');
        let stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            this.showError('Can only filter file');
            callback('');
            return;
        }

        let fileName = filePath.replace(/^.*[\\\/]/, '');
        let fileDir = filePath.substring(0, filePath.length - fileName.length);
        console.log("filePath=" + filePath);
        console.log("fileName=" + fileName);
        console.log("fileDir=" + fileDir);

        if (fileName !== 'uSDKLogFilter') {
            callback(filePath);
            return;
        }

        console.log('large file mode');

        fs.readdir(fileDir, (err : any,files : any) => {

            let pickableFiles:string[] = [];
            files.forEach((file : any) => {
                console.log(file);

                if (fs.lstatSync(fileDir + file).isDirectory()) {
                    return;
                }
                if (file === '.DS_Store' || file === 'uSDKLogFilter') {
                    return;
                }

                pickableFiles.push(file);
            });

            pickableFiles.sort();

            vscode.window.showQuickPick(pickableFiles).then((pickedFile:string|undefined) => {
                if (pickedFile === undefined) {
                    return;
                }
                let largeFilePath = fileDir + pickedFile;
                console.log(largeFilePath);
                callback(largeFilePath);
            });
        });

    }

    protected filterFile(filePath: string){
        const readline = require('readline');
        const fs = require('fs');
        var path = require('path');

        let inputPath = filePath;

        // special path tail
        let ext = path.extname(inputPath);
        let tail = '.uSDKLogFilter' + ext;

        // overwrite mode ?
        let isOverwriteMode = inputPath.indexOf(tail) !== -1;

        let outputPath = '';
        if (isOverwriteMode) {
            outputPath = inputPath;

            // change input path
            let newInputPath = inputPath + Math.floor(Date.now()/1000) + ext;
            try{
                if(fs.existsSync(newInputPath)){
                    fs.unlinkSync(newInputPath);
                }
            }catch(e){
                this.showError('unlink error : ' + e);
                return;
            }
            try{
                fs.renameSync(inputPath, newInputPath);
            }catch(e){
                this.showError('rename error : ' + e);
                return;
            }
            console.log('after rename');
            inputPath = newInputPath;
        } else {
            outputPath = inputPath + tail;

            if(fs.existsSync(outputPath)){
                console.log('output file already exist, force delete when not under overwrite mode');
                let tmpPath = outputPath + Math.floor(Date.now()/1000) + ext;
                try{
                    fs.renameSync(outputPath, tmpPath);
                    fs.unlinkSync(tmpPath);
                }catch(e){
                    console.log('remove error : ' + e);
                }
            }
        }

        console.log('overwrite mode: ' + (isOverwriteMode?'on':'off'));
        console.log('input path: ' + inputPath);
        console.log('output path: ' + outputPath);


        // open write file
        let writeStream = fs.createWriteStream(outputPath);
        writeStream.on('open', ()=>{
            console.log('write stream opened');

            // open read file
            const readLine = readline.createInterface({
                input: fs.createReadStream(inputPath)
            });

            // filter line by line
            readLine.on('line', (line: string)=>{
                // console.log('line ', line);
                let fixedline = this.matchLine(line);
                if(fixedline !== undefined){
                    writeStream.write(fixedline + '\n');
                }
            }).on('close',()=>{
                this.showInfo('Filter completed :)');
                writeStream.close();

                try{
                    if(isOverwriteMode){
                        fs.unlinkSync(inputPath);
                    }
                }catch(e){
                    console.log(e);
                }
                vscode.workspace.openTextDocument(outputPath).then((doc: vscode.TextDocument)=>{
                    vscode.window.showTextDocument(doc);
                });
            });
        }).on('error',(e :Error)=>{
            console.log('can not open write stream : ' + e);
        }).on('close', ()=>{
            console.log('closed');
        });
    }

    protected matchLine(line: string): string | undefined{
        return undefined;
    }

    protected prepare(callback : (succeed: boolean)=>void){

    }

    public filter(filePath?: string){
        this.getDocumentPathToBeFilter((docPath) => {
            if (docPath === '') {
                return;
            }

            console.log('will filter file :' + docPath);

            this.prepare((succeed)=>{
                if(!succeed){
                    return;
                }

                this.filterFile(docPath);
            });
        }, filePath);
    }
}

export { FilterLineBase};
