// 生成ast

import { PathLike } from "fs";

const fs = require('fs');
const { resolve, join } = require('path');
const acornJsx = require("acorn-jsx");
// const acornBigint = require('acorn-bigint');
const { Parser } = require("acorn");
const typescript = require("typescript");

enum FILE_STATUS {
    // 成功
    SUCCESS,
}

const projectPath = resolve(__dirname, '..');

function readAsync(file_path: PathLike): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, (err, res) => {
            if(err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

function writeAsync(file_path: PathLike, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file_path, data,(err) => {
            if(err) {
                reject(err);
            }
            resolve(FILE_STATUS.SUCCESS);
        });
    });
}

function mkdirAsync(dir_path: PathLike) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir_path,(err) => {
            if(err) {
                reject(err);
            }
            resolve(FILE_STATUS.SUCCESS);
        });
    });
}

export default class Banana {
    path: PathLike;
    Parser: any = Parser.extend(acornJsx());
    AST_JSX: any;
    sourceFile: string;
    // tsx文件位置
    templatePath: PathLike = resolve(projectPath, './test/my-template.tsx');
    templatePath_jsx: PathLike = resolve(projectPath, './test/.cache/my-template.jsx');
    cache_path: PathLike = resolve(projectPath, './test/.cache/');
    public constructor(path?: PathLike) {
        this.path = path;

        this.init().catch(err => {
            console.log('Banana.init.error: ', err);
        });
    }

    async init() {
        const source:Buffer = await readAsync(this.templatePath);
        this.sourceFile = source.toString();

        await this.transformTsxToJsx();

        const jsx = await readAsync(this.templatePath_jsx);

        this.AST_JSX = this.Parser.parse(jsx.toString(), {
            sourceType: "module",
        });

        await writeAsync(resolve(this.cache_path, 'ast_data.json'), JSON.stringify(this.AST_JSX));

        console.log('end');
    }

    async transformTsxToJsx() {
        try {
            const res = await typescript.transpileModule(this.sourceFile, {
                compilerOptions: {
                    target: "ESNext",
                    // outDir: resolve(this.templatePath, '../.cache/my-template.jsx'),
                    jsx: "preserve",
                }
            });

            await mkdirAsync(resolve(this.templatePath, '../.cache')).catch(err => err);

            await writeAsync(resolve(this.templatePath, '../.cache/my-template.jsx'), res.outputText);

        }catch(err) {
            console.log('Banana.transformTsxToJsx.error: ', err);
        }
    }
}