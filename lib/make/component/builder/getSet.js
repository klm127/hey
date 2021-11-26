/**
 * @module make/component/builder/getSetCommands
 * @description A mixin module which is called on a component builder during construction of the builder. It adds function paths for setting scaffold properties.
 */


/**
 * Adds functions to change scaffold props on a builder
 * @param {componentBuilder} builder - The make component builder function
 * @returns {module:make/component/builder/getSetCommands~componentBuilderChanges} builder - The builder, with new properties and methods added
 */
function _basicScaffoldCommands(b) {
    if(!b.scaffold) {
        return "error: incorrectly configured builder"
    }
    b.named = setNameCb(b);
    b.styled = setStyleCb(b);
    b.styled.as = setStyleCb(b);
    if(!b.of) b.of = {};
    b.of.type = setTypeCb(b);
    b.of.name = setNameCb(b);
    b.of.style = setStyleCb(b);
    if(!b.with) b.with = {};
    b.with.name = setNameCb(b);
    b.with.type = setTypeCb(b);
    b.with.content = setContentCb(b);
    b.with.properties = setPropertiesCb(b);
    if(!b.set) b.set = {};
    b.set.type = setTypeCb(b);
    b.set.type.to = setTypeCb(b);
    b.set.type.as = setTypeCb(b);
    b.set.name = setNameCb(b);
    b.set.name.to = setNameCb(b);
    b.set.style = setStyleCb(b);
    b.set.style.to = setStyleCb(b);
    b.set.content = setContentCb(b);
    b.set.content.to = setContentCb(b);
    b.set.properties = setPropertiesCb(b);
    b.set.properties.to = setPropertiesCb(b);
    if(!b.change) b.change = {};  /// make a change function .change('properties') should return the setPropertiescb
    b.change.name = setNameCb(b);
    b.change.name.to = setNameCb(b);
    b.change.type = setTypeCb(b);
    b.change.type.to = setTypeCb(b);
    b.change.style = setStyleCb(b);
    b.change.style.to = setStyleCb(b);
    b.change.content = setContentCb(b);
    b.change.content.to = setContentCb(b);
    b.change.properties = setPropertiesCb(b);
    b.change.properties.to = setPropertiesCb(b);
    b.get = getPropertiesCb(b);
    b.get.name = getNameCb(b);
    b.get.type = getTypeCb(b);
    b.get.style = getStyleCb(b);
    b.get.content = getContentCb(b);
    b.get.properties = getPropertiesCb(b);
    b.get.scaffold = getPropertiesCb(b);
    b.whose = {};
    b.whose.name = {};
    b.whose.name.is = setNameCb(b);
    b.whose.type = {};
    b.whose.type.is = setTypeCb(b);
    b.whose.style = {};
    b.whose.style.is = setStyleCb(b);
    b.whose.properties = {};
    b.whose.properties.are = setPropertiesCb(b);
    b.whose.content = {};
    b.whose.content.is = setContentCb(b);

    return b;
}

function setNameCb(builder) {
    return function(name) {
        builder.scaffold.name = name;
        return builder;
    }
}

function getNameCb(builder) {
    return function() {
        return builder.scaffold.name;
    }
}

function setTypeCb(builder) {
    return function(type) {
        builder.scaffold.type = type;
        return builder;
    }
}

function getTypeCb(builder) {
    return function() {
        return builder.scaffold.type;
    }
}

function setStyleCb(builder) {
    return function(style) {
        builder.scaffold.style = style;
        return builder;
    }
}

function getStyleCb(builder) {
    return function() {
        return builder.scaffold.style;
    }
}

function setPropertiesCb(builder) {
    return function(props) {
        Object.assign(builder.scaffold, props);
        return builder;
    }
}

function getPropertiesCb(builder) {
    return function() {
        return builder.scaffold
    }
}

function setContentCb(builder) {
    return function(content) {
        builder.scaffold.content = content;
        return builder;
    }
}

function getContentCb(builder) {
    return function() {
        return builder.scaffold.content;
    }
}

module.exports = _basicScaffoldCommands;





// ------------------ The following lines are for jsdoc -------------------




/**
 * @typedef componentBuilderChanges
 * @description function paths added to component builder after this mixin module is executed
 * @property {module:make/component/builder/getSetCommands~setName} named
 * @property {module:make/component/builder/getSetCommands~setStyle} styled
 * @property {module:make/component/builder/getSetCommands~setStyle} styled.as
 * @property {Object} of
 * @property {module:make/component/builder/getSetCommands~setType} of.type
 * @property {module:make/component/builder/getSetCommands~setName} of.name
 * @property {module:make/component/builder/getSetCommands~setStyle} of.style
 * @property {Object} with
 * @property {module:make/component/builder/getSetCommands~setName} with.name
 * @property {module:make/component/builder/getSetCommands~setType} with.type
 * @property {module:make/component/builder/getSetCommands~setContent} with.content
 * @property {module:make/component/builder/getSetCommands~setProperties} with.properties
 * @property {Object} set
 * @property {module:make/component/builder/getSetCommands~setType} set.type
 * @property {module:make/component/builder/getSetCommands~setType} set.type.to
 * @property {module:make/component/builder/getSetCommands~setType} set.type.as
 * @property {module:make/component/builder/getSetCommands~setStyle} set.style
 * @property {module:make/component/builder/getSetCommands~setStyle} set.style.to
 * @property {module:make/component/builder/getSetCommands~setContent} set.content
 * @property {module:make/component/builder/getSetCommands~setContent} set.content.to
 * @property {module:make/component/builder/getSetCommands~setProperties} set.properties
 * @property {module:make/component/builder/getSetCommands~setProperties} set.properties.to
 * @property {module:make/component/builder/getSetCommands~getProperties} get
 * @property {module:make/component/builder/getSetCommands~getName} get.name
 * @property {module:make/component/builder/getSetCommands~getType} get.type
 * @property {module:make/component/builder/getSetCommands~getStyle} get.style
 * @property {module:make/component/builder/getSetCommands~getContent} get.content
 * @property {module:make/component/builder/getSetCommands~getProperties} get.properties
 * 
 */


/**
 * Sets scaffold.style and returns the component builder
 * @function
 * @name setStyle
 * @param {Object} style - the css styles to apply
 * @returns {componentBuilder} builder
 */

/**
 * Sets scaffold.type and returns the component builder
 * @function
 * @name setType
 * @param {Object} type - the type to set
 * @returns {componentBuilder} builder
 */

/**
 * Sets scaffold.name and returns the component builder
 * @function
 * @name setName
 * @param {string} name
 * @returns {componentBuilder} builder
 */

/**
 * Object.applies properties to scaffold
 * @function
 * @name setProperties
 * @param {Object} props
 * @returns {componentBuilder} builder
 */

/**
 * Sets scaffold.content and returns the component builder
 * @function setContent
 * @param {string} content
 * @returns {componentBuilder} builder
 */

/**
 * gets scaffold.name
 * @function getName
 * @returns {string}
 */

/**
 * gets scaffold.type
 * @function getType
 * @returns {string}
 */

/**
 * gets scaffold.style
 * @function getStyle
 * @returns {Object}
 */

/**
 * gets scaffold
 * @function getProperties
 * @returns {Object}
 */

/**
 * gets scaffold.content
 * @function getContent
 * @returns {string}
 */