(function() {

    var cache = {},
        compiled = {},
        scripts = Array.prototype.map.call(
            document.querySelectorAll("script[type='text/node_module']"),
            function(script) {
                return {id: script.id, src: script.src, js: script.src ? null : script.innerHTML}
            }
        ),
        handlers = scripts.map(function(script) {
            return createHandler(script)
        })

    function doParallel(handlers, callback) {
        var counter = handlers.length,
            done = function() {
                --counter
                if (counter === 0) {
                    callback()
                }
            }
        handlers.forEach(function(f) {
            f(done)
        })
    }

    function createHandler(script) {
        return function(done) {
            if (!script.src) {
                done()
            } else {
                var request = new XMLHttpRequest()
                request.onload = function() {
                    if (request.status == 200) {
                        script.js = request.responseText
                    } else {
                        console.log("Error loading " + script.src)
                    }
                    done()
                }
                request.open("GET", script.src)
                request.send()
            }
        }
    }

    function runModule(func) {
        var module = {exports: {}},
            require = function(id) {
                if (cache[id]) {
                    return cache[id]
                } else if (compiled[id]) {
                    cache[id] = runModule(compiled[id])
                    return cache[id]
                } else {
                    if (window.require) {
                        return window.require(id)
                    } else {
                        throw new Error("Cannot find module " + id)
                    }
                }
            }
            
        try {
            func(module, module.exports, require)
        } catch(err) {
            console.log("Error running module " + func.moduleName, err)
        }
        return module.exports
    }

    doParallel(handlers, function() {
        scripts.forEach(function(script) {
            var f
            try {
                f = new Function("module, exports, require", script.js)
            } catch(err) {
                console.log("Error compiling module " + script.id, err)
            }
            f.moduleName = script.id
            compiled[script.id] = f 
        })
        if (compiled["main"]) {
            runModule(compiled["main"])
        } else {
            console.log("Module 'main' is required")
        }
    })

})()