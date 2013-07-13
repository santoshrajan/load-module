### Load Un-Browserified modules in your browser.

#### Why use this?
If you are like me, and just want to hit "reload" every time you make changes, this is for you.

#### How does it work?
Set your un-browserified scripts to `type="text/node_module"` and `id="mymodule"`. Require `mymodule` in other scripts. You should also have a module with id `main` as the entry point to your program.

Finally include `load-module.js` in `js` folder above as the last script to be loaded.

Once you are done testing just browserify your "main" script and bundle it. (Don't forget to remove `text/node_module` script tags.)

#### Example (read comments for more info)

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>load-module example</title>
    </head>
    <body>
    
      <!-- You should load browserified node modules first, if you are going to require
           them in your modules. Script below loads the browserified "tape" test module
           from browserified cdn. -->
      <script type="text/javascript" src="http://wzrd.in.nyud.net/bundle/tape"></script>
    
      <!-- We load "browsertest.js" an un-browserified module. Note that the type is
           "text/node_module", and we give it a module id "tests" so that we can require
           it in other modules. Unlike JavaScript un-browserified modules are NOT loaded
           in the global scope.-->
      <script type="text/node_module" id="tests" src="./js/browsertest.js"></script>
    
      <!-- You can also have inline un-browserified modules. Note that each script of type
           "text/node_module" is treated as a module and NOT loaded in the global scope
           like javascript scripts. -->
      <script type="text/node_module" id="square">
        module.exports = function(x) {
          return x * x
        }
      </script>
    
      <!-- You must include a module with id "main" which is the entry point to your 
            program. Both "square" and "main" module need not be inline.-->
      <script type="text/node_module" id="main">
    
        require("tests") // we just want to run the tests module
    
        var test = require("tape")
            square = require("square")
    
        test("Square Module Test", function(t) {
          t.plan(1)
          t.equal(square(10), 100)
        })
      </script>
    
      <!-- load-module.js must be the last script loaded -->
      <script type="text/javascript" src="./js/load-module.js"></script>
    
    </body>
    </html>