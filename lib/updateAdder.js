
/**
 * Used by "when"
 */
function updateAdderCommand(componentBuilder) {

    function updateBuilder() {

    }
    function getParent() {
        return componentBuilder;
    }
    updateBuilder.parent = getParent;
    updateBuilder.get = {
        parent: getParent,
        updater: getParent,
    }
    


    return updateBuilder;
}