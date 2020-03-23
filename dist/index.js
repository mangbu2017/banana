"use strict";
// 生成ast
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var _a = require('path'), resolve = _a.resolve, join = _a.join;
var acornJsx = require("acorn-jsx");
// const acornBigint = require('acorn-bigint');
var Parser = require("acorn").Parser;
var typescript = require("typescript");
var FILE_STATUS;
(function (FILE_STATUS) {
    // 成功
    FILE_STATUS[FILE_STATUS["SUCCESS"] = 0] = "SUCCESS";
})(FILE_STATUS || (FILE_STATUS = {}));
var projectPath = resolve(__dirname, '..');
function readAsync(file_path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file_path, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}
function writeAsync(file_path, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(file_path, data, function (err) {
            if (err) {
                reject(err);
            }
            resolve(FILE_STATUS.SUCCESS);
        });
    });
}
function mkdirAsync(dir_path) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(dir_path, function (err) {
            if (err) {
                reject(err);
            }
            resolve(FILE_STATUS.SUCCESS);
        });
    });
}
var Banana = /** @class */ (function () {
    function Banana(path) {
        this.Parser = Parser.extend(acornJsx());
        // tsx文件位置
        this.templatePath = resolve(projectPath, './test/my-template.tsx');
        this.templatePath_jsx = resolve(projectPath, './test/.cache/my-template.jsx');
        this.cache_path = resolve(projectPath, './test/.cache/');
        this.path = path;
        this.init().catch(function (err) {
            console.log('Banana.init.error: ', err);
        });
    }
    Banana.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var source, jsx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readAsync(this.templatePath)];
                    case 1:
                        source = _a.sent();
                        this.sourceFile = source.toString();
                        return [4 /*yield*/, this.transformTsxToJsx()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, readAsync(this.templatePath_jsx)];
                    case 3:
                        jsx = _a.sent();
                        this.AST_JSX = this.Parser.parse(jsx.toString(), {
                            sourceType: "module",
                        });
                        return [4 /*yield*/, writeAsync(resolve(this.cache_path, 'ast_data.json'), JSON.stringify(this.AST_JSX))];
                    case 4:
                        _a.sent();
                        console.log('end');
                        return [2 /*return*/];
                }
            });
        });
    };
    Banana.prototype.transformTsxToJsx = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, typescript.transpileModule(this.sourceFile, {
                                compilerOptions: {
                                    target: "ESNext",
                                    // outDir: resolve(this.templatePath, '../.cache/my-template.jsx'),
                                    jsx: "preserve",
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, mkdirAsync(resolve(this.templatePath, '../.cache')).catch(function (err) { return err; })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, writeAsync(resolve(this.templatePath, '../.cache/my-template.jsx'), res.outputText)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log('Banana.transformTsxToJsx.error: ', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Banana;
}());
exports.default = Banana;
