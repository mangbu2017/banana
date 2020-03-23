import Banana from './index';
import Traversing from "./Traversing";

class Test {

    constructor() {
        this.init();
    }

    private init () {
        new Banana();

        console.log('******生成ast********');

        const ast = require('../test/.cache/ast_data.json');

        new Traversing(ast);
    }
}

new Test();
