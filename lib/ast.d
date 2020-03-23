interface Node {
    type: string;
    start: number;
    end: number;
}

interface IdNode extends Node {
    name: "window";
}

interface KeyNode extends Node {
    name: "clickLog"
}

// 普通标示符
interface IdentifierNode extends Node {
    name: string;
}

// jsx标示符
interface JSXIdentifierNode extends IdentifierNode {}

// es6 解构赋值
interface ObjectPatternNode extends Node {
    properties: Array<PropertyNode>;
}

interface ReturnStatementNode extends Node {
    argument: IdentifierNode;
}

interface BlockStatementNode extends Node {
    body: Array<ReturnStatementNode>;
}

interface RootNode extends Node {
    body: Array<any>;
    sourceType: "module";
}

interface VariableDeclaratorNode extends Node {
    declarations: Array<any>;
    kind?: "const";
    id: {};
    init: {};
}

interface ExportDefaultDeclarationNode extends Node {
    // 声明
    declaration: ArrowFunctionExpressionNode;
}

// 对象表达式
interface ObjectExpressionNode extends Node {
    properties: Array<any>;
}


interface PropertyNode extends Node {
    method: boolean;
    // 速记?
    shorthand: boolean;
    computed: boolean;
    key: KeyNode;
    value: FunctionExpressionNode|IdentifierNode;
    kind: "init";
}

interface ElementNode extends Node {
    name: JSXIdentifierNode;
}

interface OpeningElement extends ElementNode {
    selfClosing: boolean;
    attributes: Array<JSXAttributeNode>;
}

interface ClosingElement extends ElementNode {}

interface JSXTextNode extends Node {
    value: string;
    raw: string;
}

interface LiteralNode extends Node {
    value: string;
    raw: string;
}

interface MemberExpressionNode extends Node {
    object: IdentifierNode;
    property: IdentifierNode;
    computed: boolean;
}

interface CallExpressionNode extends Node {
    callee: MemberExpressionNode;
    arguments: Array<ArrowFunctionExpressionNode>
}

interface JSXExpressionContainerNode extends Node {
    expression: CallExpressionNode;
}

interface JSXAttributeNode extends Node {
    name: JSXIdentifierNode;
    value: LiteralNode;
}

interface JSXElementNode extends Node {
    openingElement: OpeningElement;
    closingElement: ClosingElement;
    children: Array<JSXElementNode|JSXTextNode|JSXExpressionContainerNode>;
}

interface FunctionExpressionNode extends Node {
    id: null;
    expression: boolean;
    generator: boolean;
    async: boolean;
    params: Array<IdentifierNode>;
    body: BlockStatementNode|JSXElementNode;
}

interface ArrowFunctionExpressionNode extends FunctionExpressionNode {}



