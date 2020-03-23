"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var Traversing_1 = __importDefault(require("./Traversing"));
var Test = /** @class */ (function () {
    function Test() {
        this.init();
    }
    Test.prototype.init = function () {
        new index_1.default();
        console.log('******生成ast********');
        var ast = require('../test/.cache/ast_data.json');
        new Traversing_1.default(ast);
    };
    return Test;
}());
new Test();
