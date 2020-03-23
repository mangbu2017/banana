import { print, prettyPrint } from 'recast';
import * as recast from 'recast';
const fs = require('fs');
const { resolve } = require('path');
// import D from "../node_modules/ast-types/gen/namedTypes";
// import {
//     NodePath,
//     namedTypes,
// } from 'ast-types';
import {
    namedTypes
} from 'ast-types';
import {
    NodePath,
    NodePathConstructor,
} from '../node_modules/ast-types/lib/node-path';

const {
    identifier,
    callExpression,
    blockStatement,
    arrowFunctionExpression,
    jsxAttribute,
    jsxIdentifier,
    literal,
    JSXText,
    // 模板字符串
    templateLiteral,
    // 模版字符串-字符串
    templateElement,
    // 模版字符串-变量(表达式)
    memberExpression,
    jsxExpressionContainer,
    jsxMemberExpression,
    jsxElement,
    jsxOpeningElement,
    jsxClosingElement,
} = recast.types.builders;
const T = recast.types.namedTypes;

const jsxAttrs = {
    className: 'class',
};

interface TagInfo {
    path: any;
    openCode: string;
    closeCode: string;
}

export default class Traversing {
    private static emptyStrReg: RegExp = /^\f*$/;
    ast: any;
    res: any;
    index:number = 0;
    output:string = resolve(__dirname, '../test/.cache/');
    flag:boolean = true;
    count: number = 0;
    replaceIdentifier = jsxIdentifier('replacejsxelement');
    replaceClose = jsxClosingElement(this.replaceIdentifier);
    replaceOpen = jsxOpeningElement(this.replaceIdentifier);
    codeStore: Array<TagInfo> = [];
    constructor(ast: any) {
        console.log('Traversing.constructor');
        this.ast = ast;
        this.init();
    }

    init() {
        const _this = this;

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
                visitJSXElement(path) {
                    _this.count ++;
                    console.log('element count: ', _this.count);

                    _this.resolveJSXElement(path);

                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXExpressionContainer(path: NodePath<namedTypes.JSXExpressionContainer>) {
                    _this.resolveJSXExpressionContainer(path);
                    this.traverse(path);
                },
                visitTemplateLiteral(path: NodePath<namedTypes.TemplateLiteral>) {
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
            const code = prettyPrint(this.res).code;

            // fs.writeFileSync(resolve(this.output, './output.tsx'), code);
            fs.writeFileSync(resolve(this.output, './output.tsx'), code.replace(/<\/?replacejsxelement>/g, ''));

        }catch(err) {
            console.log('Traversing.init: ', err);
        }
    }

    private resolveJSXChildren(children: Array<any>) {
        let currentText = '';

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

        for(let i = 0, len = children.length; i  < len; i ++) {
            const item = children[i],
                  val = item.value;

            // if(T.JSXText.check(item)) {
            //     if(Traversing.emptyStrReg.test(val))
            //         continue;
            // }
        }
    }

    private findParent(node): any {
        function fn(arr) {
            for(let i = 0; i < arr.length; i ++) {
                const parentPath = arr[i].path.parentPath;
                if(parentPath === node.parentPath) {
                    return arr[i].path;
                }
            }
        }
    }

    private resolveJSXElement({ node, parentPath }: NodePath<namedTypes.JSXElement>) {

        // 获取父节点
        const parentNode = parentPath.node;
        // console.log('pN: ', parentNode);
        // 应该没啥用
        // if(!T.JSXElement.check(node))
        //     return false;

        const open = node.openingElement,
            close = node.closingElement;

        let templateElementLeft = null,
            templateElementRight = null;

        if(T.JSXIdentifier.check(open.name)) {
            const ident = `<${open.name.name}>`;

            templateElementLeft = templateElement({
                // 修改过的
                cooked: ident,
                // 未加工的 取的是这个是值
                raw: ident,
            }, false);
            console.log('ident: ', ident);
            // console.log(templateElementLeft);
        }

        if(T.JSXIdentifier.check(close.name)) {
            if(!open.selfClosing) {
                const ident = `</${close.name.name}>`;
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

        const indent = identifier('LiuYuhang');
        const indent2 = identifier('xxxxx');
        const expression = memberExpression(
            indent, // 表达式类型
            indent2, // 标识符(变量名称)|表达式
            false, // 表达式?
        );

        // console.log('parentNode.body: ', parentNode.body);

        const unuseTE = templateElement({
            // 修改过的
            cooked: ' ',
            // 未加工的 取的是这个是值
            raw: ' ',
        }, false);

        const replaceJSXElement = jsxElement(this.replaceOpen, this.replaceClose, node.children);
        // console.log('replaceJSXElement: ', replaceJSXElement);
        const innerTL = templateLiteral([unuseTE], [replaceJSXElement]);
        const aFExpression = arrowFunctionExpression([], innerTL, true);

        // console.log('innerTL: ', innerTL);

        /*
            1. 这里的构建是要求有次序的
            2. 可以不用expressions ???
         */
        const tl = templateLiteral([templateElementLeft, templateElementRight], [replaceJSXElement]); // 什么表达式都行
        // console.log('what  a fuck :', print(node));

        // console.log('tl: ', tl);

        /*
            1. 目前只发现 body|children两种情况
         */
        if(parentNode.body) { // `<span></span>`
            console.log('body');
            parentNode.body = tl;
        }else if(parentNode.children instanceof Array) { // ${`<span></span>`}
            console.log('children');
            const index = parentNode.children.indexOf(node);
            parentNode.children[index] = tl;
        }


        // console.log('open: ', open);

        // const template = TemplateLiteral();

        // console.log('node: ', _this.createOpeningStr(node.openingElement));

        // const tl = templateLiteral([],[])
    }

    resolveJSXExpressionContainer({ node, parentPath }: NodePath<namedTypes.JSXExpressionContainer>) {
        const parentNode = parentPath.node,
              expression = node.expression;

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
    }

    record(path: any, mark: string) {
        fs.writeFileSync(
            resolve(this.output, `./node_script_${mark}_${this.index}.jsx`),
            prettyPrint(path.node, {
                tabWidth: 4,
            },
        ).code);
        this.index ++;
    }

    createOpeningStr({ attributes }: any) {

        const attr = this.createAttrStr(attributes);

        console.log('attr: ', attr);
    }

    createClosingStr(node) {

    }

    createAttrStr = (attrs: any) => attrs.map(({
        type,
        name,
        value,
    }) => {
        if(type !== "JSXAttribute")
            throw new Error('createAttrStr');

        let key = name.name;
        key = jsxAttrs[key] && (key = jsxAttrs[key]);

        return `${key}=${value.value}`;
    }).join(' ')

}
