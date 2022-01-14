/********************************************************************************
 * Copyright (C) 2019 Elliott Wen.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { LatexParser } from './latexLogParser';
import { Annotation, EngineVersion } from '../types';
export enum EngineStatus {
    Init = 1,
    Ready,
    Busy,
    Error,
}

const XELATEX_ENGINE_PATH = 'bin/swiftlatex.js';
const PDFLATEX_ENGINE_PATH = 'bin/swiftlatexpdftex.js';

export class CompileResult {
    pdf: Uint8Array | undefined = undefined;
    status: number = -254;
    log: string = 'No log';
    errors: Annotation[] = [];
}

export class LaTeXEngine {
    private enginePath = XELATEX_ENGINE_PATH;
    private engineType: EngineVersion = 'XeLaTeX';
    private latexWorker: Worker | undefined = undefined;
    latexWorkerStatus: EngineStatus = EngineStatus.Init;
    constructor(engineType: EngineVersion = 'XeLaTeX') {
        this.engineType = engineType;
        if (engineType !== 'XeLaTeX') {
            this.enginePath = PDFLATEX_ENGINE_PATH;
        }
    }

    async loadEngine(): Promise<void> {
        if (this.latexWorker !== undefined) {
            throw new Error('Other instance is running, abort()');
        }
        this.latexWorkerStatus = EngineStatus.Init;
        await new Promise((resolve, reject) => {
            this.latexWorker = new Worker(this.enginePath);
            this.latexWorker.onmessage = (ev: any) => {
                const data: any = ev.data;
                const cmd: string = data.result as string;
                if (cmd === 'ok') {
                    this.latexWorkerStatus = EngineStatus.Ready;
                    resolve();
                } else {
                    this.latexWorkerStatus = EngineStatus.Error;
                    reject();
                }
            };
        });
        this.latexWorker!.onmessage = (_: any) => {};
        this.latexWorker!.onerror = (_: any) => {};
    }

    isReady(): boolean {
        return this.latexWorkerStatus === EngineStatus.Ready;
    }

    private checkEngineStatus(): void {
        if (!this.isReady()) {
            throw Error('Engine is still spinning or not ready yet!');
        }
    }

    private parseLog(log: string): Annotation[] {
        const parser = new LatexParser(log);
        const result = parser.parse();
        // console.log(log);
        // console.log(result);
        const converterError = [];
        for (let t = 0; t < result.errors.length; t++) {
            const element = result.errors[t];
            if (element.line === null || element.line === undefined) {
                element.line = 0;
            }
            const tmp: Annotation = {
                startLineNumber: element.line,
                endLineNumber: element.line,
                startColumn: 0,
                endColumn: 1024,
                message: element.message + ' in line ' + element.line,
                severity: 4,
                source: element.file ? element.file : 'Entry',
            };
            converterError.push(tmp);
        }

        for (let t = 0; t < result.warnings.length; t++) {
            const element = result.warnings[t];
            if (element.line === null || element.line === undefined) {
                element.line = 0;
            }
            const tmp: Annotation = {
                startLineNumber: element.line,
                endLineNumber: element.line,
                startColumn: 0,
                endColumn: 1024,
                message: element.message + ' on line ' + element.line,
                severity: 1,
                source: element.file ? element.file : 'Entry',
            };
            converterError.push(tmp);
        }
        return converterError;
    }

    async compileLaTeX(desiredDVI: boolean = false): Promise<CompileResult> {
        this.checkEngineStatus();
        this.latexWorkerStatus = EngineStatus.Busy;

        // await new Promise(resolve => setTimeout(resolve, 5000));
        const res: CompileResult = await new Promise((resolve, _) => {
            this.latexWorker!.onmessage = (ev: any) => {
                const data: any = ev.data;
                const cmd: string = data.cmd as string;
                if (cmd !== 'compile') {
                    return;
                }
                const result: string = data.result as string;
                const log: string = data.log as string;
                const status: number = data.status as number;
                this.latexWorkerStatus = EngineStatus.Ready;

                const nice_report = new CompileResult();
                nice_report.status = status;
                nice_report.log = log;
                nice_report.errors = this.parseLog(log);
                if (result === 'ok') {
                    const pdf: Uint8Array = new Uint8Array(data.pdf);
                    nice_report.pdf = pdf;
                } else {
                    if (nice_report.errors.length === 0) {
                        const dummyAnnotation: Annotation = {
                            startLineNumber: 1,
                            endLineNumber: 1,
                            startColumn: 0,
                            endColumn: 1024,
                            message: `Unexpected error happened, please check the detailed log. Status ${status}, Engine: ${this.engineType}`,
                            severity: 4,
                            source: 'SwiftLaTeX',
                        };
                        nice_report.errors = [dummyAnnotation];
                    }
                }
                resolve(nice_report);
            };
            this.latexWorker!.postMessage({ cmd: 'compilelatex', dvi: desiredDVI });
        });
        this.latexWorker!.onmessage = (_: any) => {};

        return res;
    }

    /* Internal Use */
    async compileFormat(): Promise<void> {
        this.checkEngineStatus();
        this.latexWorkerStatus = EngineStatus.Busy;
        await new Promise((resolve, reject) => {
            this.latexWorker!.onmessage = (ev: any) => {
                const data: any = ev.data;
                const cmd: string = data.cmd as string;
                if (cmd !== 'compile') {
                    return;
                }
                const result: string = data.result as string;
                const log: string = data.log as string;
                // const status: number = data['status'] as number;
                this.latexWorkerStatus = EngineStatus.Ready;
                if (result === 'ok') {
                    const formatArray = data.pdf; /* PDF for result */
                    const formatBlob = new Blob([formatArray], {
                        type: 'application/octet-stream',
                    });
                    const formatURL = URL.createObjectURL(formatBlob);
                    setTimeout(() => {
                        URL.revokeObjectURL(formatURL);
                    }, 30000);
                    console.log('Download format file via ' + formatURL);
                    resolve();
                } else {
                    reject(log);
                }
            };
            this.latexWorker!.postMessage({ cmd: 'compileformat' });
        });
        this.latexWorker!.onmessage = (_: any) => {};
    }

    setEngineMainFile(filename: string): void {
        this.checkEngineStatus();
        if (this.latexWorker !== undefined) {
            this.latexWorker.postMessage({ cmd: 'setmainfile', url: filename });
        }
    }

    writeMemFSFile(filename: string, srccode: string | ArrayBuffer): void {
        this.checkEngineStatus();
        if (srccode === undefined) {
            return;
        }
        if (srccode instanceof ArrayBuffer) {
            srccode = new Uint8Array(srccode);
        }
        if (this.latexWorker !== undefined) {
            this.latexWorker.postMessage({ cmd: 'writefile', url: filename, src: srccode });
        }
    }

    makeMemFSFolder(folder: string): void {
        this.checkEngineStatus();
        if (this.latexWorker !== undefined) {
            if (folder === '' || folder === '/') {
                return;
            }
            this.latexWorker.postMessage({ cmd: 'mkdir', url: folder });
        }
    }

    flushCache(): void {
        this.checkEngineStatus();
        if (this.latexWorker !== undefined) {
            // console.warn('Flushing');
            this.latexWorker.postMessage({ cmd: 'flushcache' });
        }
    }

    closeWorker(): void {
        if (this.latexWorker !== undefined) {
            this.latexWorker.postMessage({ cmd: 'grace' });
            this.latexWorker = undefined;
        }
    }
}
