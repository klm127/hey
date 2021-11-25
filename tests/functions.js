
const hey = function(name) {
    if(name=='app') {
        if(hey.app) {
            return(hey.app)
        } else {
            console.log("app doesnt exist!")
        }
    }
    else {
        if(hey.app) {
            hey.app(name);
        }
    }
}

hey.make = function(name) {
    if(name == "app") {
        hey.app = {
            make: function(name){
                console.log(`making ${name} in app`)
            }
        }
        return hey
    }
    else {
        if(!hey.app) {
            console.log(`can't make ${name} without an app!`)
        }
        else {
            hey.app.make(name);
        }
    }
}

hey('app')
hey.make('app')
hey('app').make('element')


