Acorn is designed to support plugins which can, within reasonable bounds,  
redefine the way the parser works. Plugins can add new token types and  
new tokenizer contexts (if necessary), and extend methods in the parser object.  
This is not a clean, elegant API—using it requires an understanding of Acorn's internals,  
and plugins are likely to break whenever those internals are significantly changed.  
But still, it is possible, in this way, to create parsers for JavaScript dialects without 
forking all of Acorn.  
And in principle it is even possible to combine such plugins,  
so that if you have, for example,  
a plugin for parsing types and a plugin for parsing JSX-style XML literals,  
you could load them both and parse code with both JSX tags and types.

A plugin is a function from a parser class to an extended parser class.  
Plugins can be used by simply applying them to the Parser class  
(or a version of that already extended by another plugin).  
But because that gets a little awkward, syntactically, 
when you are using multiple plugins, the static method Parser.  
extend can be called with any number of plugin values as arguments to create  
a Parser class extended by all those plugins.  
You'll usually want to create such an extended class only once,  
and then repeatedly call parse on it, 
to avoid needlessly confusing the JavaScript engine's optimizer.


### acorn 生成的AST的数据结构

#### VariableDeclaration 变量声明
#### ExportDefaultDeclaration export default声明
#### JSXElement jsx元素
