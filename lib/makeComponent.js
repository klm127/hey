




/**
 *
 * @implements heypi.makeable
 * @implements heypi.component
 */
function makeComponentCommandBuilder(ctx) {    

    let scaffold = {
    }

    function builder(parent) {
        if(!parent) {
            parent = ctx.app;
        }
        scaffold.parent = parent;
        scaffold.children = [];
        for(let childBuilder of builder.children) {
            scaffold.children.push(childBuilder(scaffold));
        }
        return scaffold;
    }
    builder.name = '';
    builder.children = [];

    function ofType(typename) {
        scaffold.type = typename;
        builder.type = null;
        return builder
    }
    
    function named(name) {
        scaffold.name = name;
        builder.name = name;
        return builder
    }
    builder.named = named;
    builder.name = '';

    function withProperties(properties) {
        Object.assign(scaffold, properties);
        return builder;
    }
    function withStyle(style) {
        if(!scaffold.style) scaffold.style = {};
        Object.assign(scaffold.style, style);
        return builder;
    }
    function withContent(content) {
        scaffold.content = content;
        return builder;
    }
    function withChild(builderOrstring) {
        if(!builderOrstring || typeof builderOrstring == "string")  {
            return withNewChild(builderOrstring);
        }
        else {
            return attachChild(builderOrstring);
        }     
    }
    function attachChild(anotherbuilder) {
        anotherbuilder.parent = builder;
        builder.children.push(anotherbuilder);   
        return anotherbuilder;
    }
    function withNewChild(name) {
        let makeCommand = name ? name : "component";
        let newbuilder = ctx.app.make(makeCommand);
        return attachChild(newbuilder);
    }
    function withSibling(builderOrstring) {
        let newbuilder;
        if(!builderOrstring) {
            builderOrstring = "component";
        }
        if(typeof builderOrstring == "string") {
            newbuilder = ctx.app.make(builderOrstring);
        } else {
            newbuilder = builderOrstring;
        }
        builder.parent.add.child(newbuilder);
        return newbuilder;
    }
    function removeFromParent() {
        if(builder.parent) builder.parent.remove.child(builder);
        builder.parent = null;
        return builder;
    }
    function removeChild(childBuilder) {
        builder.children.filter( (child) => {
            return child != childBuilder
        });
        return builder;
    }
    function getChild(childBuilder) {
        if(typeof childBuilder == "string") {
            for(let b of builder.children) {
                if(b.scaffold.name == childBuilder) {
                    return b;
                }
            }
        } else if(typeof childBuilder == number) {
            return builder.children[childBuilder];
        } else {
            let index = builder.children.indexOf(childBuilder);
            return index < 0 ? "couldn't find child" : builder.children[index];
        }
    }
    function addParent(parent) {
        builder.parent = parent;
        return builder;
    }
    function getParent() {
        return builder.parent ? builder.parent : `no parent for builder ${builder.name}`;
    }

    builder.get = {
        children: builder.children,
        child: getChild,
        parent: getParent
    }

    builder.decouple = removeFromParent
    builder.decouple.from = removeFromParent;
    builder.attach = addParent
    builder.attach.to = addParent
    
    builder["with"] = {
        properties: withProperties,
        "style": withStyle,
        content: withContent,
        child: withChild,
        name: named,
        type: ofType,
        sibling: withSibling,
        "new": {
            child: withChild
        },
        parent: getParent
    }
    builder.with.content["of"] = withContent;
    builder.with.content.of.text = withContent;
    builder.with.content.text = {
        "of": withContent
    }
    builder.add = {
        "new": {
            child: withChild
        },
        child: withChild,
        parent: getParent,
        sibling: withSibling
    }
    builder.remove = {
        child: removeChild,
        parent: removeFromParent
    }

    builder["of"] = {
        "type": ofType,
    }
    builder.change = {
        name: named,
        type: ofType,
        style: withStyle,
        content: withContent,
        properties: withProperties
    }
    builder.set = {
        name: named,
        type: ofType,
        style: withStyle,
        content: withContent,
        properties: withProperties
    }
    builder.change.name.to = named;
    builder.change.type.to = ofType;
    builder.change.style.to = withStyle;
    builder.change.content.to = withContent;
    builder.change.properties.to = withProperties;
    builder.whose = {
        parent: getParent,
        next: {
            child: null

        }
    }

    builder.has = {
        sibling: withSibling,
        child: withChild,
        name: named,
        type: ofType,
        content: withContent,
        properties: withProperties
    }


    builder.is = {
        named: named,
        "of": {
           "type": ofType, 
        },
        "type": ofType
    }

    return builder;

}


module.exports = makeComponentCommandBuilder;