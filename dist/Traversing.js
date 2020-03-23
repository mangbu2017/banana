"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var recast_1 = require("recast");
var recast = __importStar(require("recast"));
var fs = require('fs');
var resolve = require('path').resolve;
var _a = recast.types.builders, identifier = _a.identifier, callExpression = _a.callExpression, blockStatement = _a.blockStatement, arrowFunctionExpression = _a.arrowFunctionExpression, jsxAttribute = _a.jsxAttribute, jsxIdentifier = _a.jsxIdentifier, literal = _a.literal, JSXText = _a.JSXText, 
// 模板字符串
templateLiteral = _a.templateLiteral, 
// 模版字符串-字符串
templateElement = _a.templateElement, 
// 模版字符串-变量(表达式)
memberExpression = _a.memberExpression, jsxExpressionContainer = _a.jsxExpressionContainer, jsxMemberExpression = _a.jsxMemberExpression, jsxElement = _a.jsxElement, jsxOpeningElement = _a.jsxOpeningElement, jsxClosingElement = _a.jsxClosingElement;
var T = recast.types.namedTypes;
var jsxAttrs = {
    className: 'class',
};
var Traversing = /** @class */ (function () {
    function Traversing(ast) {
        this.index = 0;
        this.output = resolve(__dirname, '../test/.cache/');
        this.flag = true;
        this.count = 0;
        this.replaceIdentifier = jsxIdentifier('replacejsxelement');
        this.replaceClose = jsxClosingElement(this.replaceIdentifier);
        this.replaceOpen = jsxOpeningElement(this.replaceIdentifier);
        this.codeStore = [];
        this.createAttrStr = function (attrs) { return attrs.map(function (_a) {
            var type = _a.type, name = _a.name, value = _a.value;
            if (type !== "JSXAttribute")
                throw new Error('createAttrStr');
            var key = name.name;
            key = jsxAttrs[key] && (key = jsxAttrs[key]);
            return key + "=" + value.value;
        }).join(' '); };
        console.log('Traversing.constructor');
        this.ast = ast;
        this.init();
    }
    Traversing.prototype.init = function () {
        var _this = this;
        try {
            this.res = recast.visit(this.ast, {
                // test succes 已经掌握如何修改ast
                // visitJSXAttribute({ node , parentPath }): any {
                //     const fuck = jsxIdentifier('fuck');
                //     const you = literal('you');
                //     const newAttr = jsxAttribute(fuck, you);
                //
                //     const index = parentPath.value.indexOf(node);
                //
                //     parentPath.value[index] = newAttr;
                //
                //     return false;
                // },
                // visitJSXOpeningElement(path): any {
                //     console.log('jsxopen');
                //     this.traverse(path);
                // },
                visitJSXElement: function (path) {
                    _this.count++;
                    console.log('element count: ', _this.count);
                    _this.resolveJSXElement(path);
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXExpressionContainer: function (path) {
                    _this.resolveJSXExpressionContainer(path);
                    this.traverse(path);
                },
                visitTemplateLiteral: function (path) {
                    // console.log('TL: ', path);
                    this.traverse(path);
                }
                // visitJSXExpressionContainer(path) {
                //     console.log(444);
                //     // _this.record(path, 'expCon');
                //     this.traverse(path);
                // },
            });
            console.log('before write');
            var code = recast_1.prettyPrint(this.res).code;
            // fs.writeFileSync(resolve(this.output, './output.tsx'), code);
            fs.writeFileSync(resolve(this.output, './output.tsx'), code.replace(/<\/?replacejsxelement>/g, ''));
        }
        catch (err) {
            console.log('Traversing.init: ', err);
        }
    };
    Traversing.prototype.resolveJSXChildren = function (children) {
        var currentText = '';
        // for(let i = )
        // children.forEach(item => {
        //    if(T.JSXText.check(item)) {
        //        const val = item.value;
        //        //
        //        if(!Traversing.emptyStrReg.test(val)) {
        //
        //        }
        //    }
        // });
        for (var i = 0, len = children.length; i < len; i++) {
            var item = children[i], val = item.value;
            // if(T.JSXText.check(item)) {
            //     if(Traversing.emptyStrReg.test(val))
            //         continue;
            // }
        }
    };
    Traversing.prototype.findParent = function (node) {
        function fn(arr) {
            for (var i = 0; i < arr.length; i++) {
                var parentPath = arr[i].path.parentPath;
                if (parentPath === node.parentPath) {
                    return arr[i].path;
                }
            }
        }
    };
    Traversing.prototype.resolveJSXElement = function (_a) {
        var node = _a.node, parentPath = _a.parentPath;
        // 获取父节点
        var parentNode = parentPath.node;
        // console.log('pN: ', parentNode);
        // 应该没啥用
        // if(!T.JSXElement.check(node))
        //     return false;
        var open = node.openingElement, close = node.closingElement;
        var templateElementLeft = null, templateElementRight = null;
        if (T.JSXIdentifier.check(open.name)) {
            var ident = "<" + open.name.name + ">";
            templateElementLeft = templateElement({
                // 修改过的
                cooked: ident,
                // 未加工的 取的是这个是值
                raw: ident,
            }, false);
            console.log('ident: ', ident);
            // console.log(templateElementLeft);
        }
        if (T.JSXIdentifier.check(close.name)) {
            if (!open.selfClosing) {
                var ident = "</" + close.name.name + ">";
                templateElementRight = templateElement({
                    cooked: ident,
                    raw: ident,
                }, true);
                console.log('ident: ', ident);
            }
            // console.log(templateElementRight);
        }
        // const res = this.resolveJSXChildren(node.children);
        // traverse(node.children);
        var indent = identifier('LiuYuhang');
        var indent2 = identifier('xxxxx');
        var expression = memberExpression(indent, // 表达式类型
        indent2, // 标识符(变量名称)|表达式
        false);
        // console.log('parentNode.body: ', parentNode.body);
        var unuseTE = templateElement({
            // 修改过的
            cooked: ' ',
            // 未加工的 取的是这个是值
            raw: ' ',
        }, false);
        var replaceJSXElement = jsxElement(this.replaceOpen, this.replaceClose, node.children);
        // console.log('replaceJSXElement: ', replaceJSXElement);
        var innerTL = templateLiteral([unuseTE], [replaceJSXElement]);
        var aFExpression = arrowFunctionExpression([], innerTL, true);
        // console.log('innerTL: ', innerTL);
        /*
            1. 这里的构建是要求有次序的
            2. 可以不用expressions ???
         */
        var tl = templateLiteral([templateElementLeft, templateElementRight], [replaceJSXElement]); // 什么表达式都行
        // console.log('what  a fuck :', print(node));
        // console.log('tl: ', tl);
        /*
            1. 目前只发现 body|children两种情况
         */
        if (parentNode.body) { // `<span></span>`
            console.log('body');
            parentNode.body = tl;
        }
        else if (parentNode.children instanceof Array) { // ${`<span></span>`}
            console.log('children');
            var index = parentNode.children.indexOf(node);
            parentNode.children[index] = tl;
        }
        // console.log('open: ', open);
        // const template = TemplateLiteral();
        // console.log('node: ', _this.createOpeningStr(node.openingElement));
        // const tl = templateLiteral([],[])
    };
    Traversing.prototype.resolveJSXExpressionContainer = function (_a) {
        var node = _a.node, parentPath = _a.parentPath;
        var parentNode = parentPath.node, expression = node.expression;
        // console.log('node :', node);
        // if(T.CallExpression.check(expression)) {
        //     console.log('lalala');
        //
        //
        // }else {
        //     const code = print(expression).code;
        //     // console.log('xxxxxx: ', );
        //     parentNode.body = identifier('${' + code + '}');
        //     // const mE = memberExpression();
        // }
    };
    Traversing.prototype.record = function (path, mark) {
        fs.writeFileSync(resolve(this.output, "./node_script_" + mark + "_" + this.index + ".jsx"), recast_1.prettyPrint(path.node, {
            tabWidth: 4,
        }).code);
        this.index++;
    };
    Traversing.prototype.createOpeningStr = function (_a) {
        var attributes = _a.attributes;
        var attr = this.createAttrStr(attributes);
        console.log('attr: ', attr);
    };
    Traversing.prototype.createClosingStr = function (node) {
    };
    Traversing.emptyStrReg = /^\f*$/;
    return Traversing;
}());
exports.default = Traversing;
