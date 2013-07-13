### Load Un-Browserified modules in your browser.

#### Why use this?
If you are like me, and just want to hit "reload" every time you make changes, this is for you.

#### How does it work.
Set your un-browserified scripts to 'type="text/node_module"' and 'id="mymodule"'. Require "mymodule" in other scripts. You ahould also have a module with id "main" as the entry point to your program.

Finally include lode-module.js as the last script to be loaded.

Once you are done testing just browserify your "main" script and bundle it.

#### Example (read comments for more info)

    &lt;!DOCTYPE html&gt;
    &lt;html lang=&quot;en&quot;&gt;
    &lt;head&gt;
      &lt;title&gt;load-module example&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    
      &lt;!-- You should load browserified node modules first, if you are going to require
           them in your modules. Script below loads the browserified &quot;tape&quot; test module
           from browserified cdn. --&gt;
      &lt;script type=&quot;text/javascript&quot; src=&quot;http://wzrd.in.nyud.net/bundle/tape&quot;&gt;&lt;/script&gt;
    
      &lt;!-- We load &quot;browsertest.js&quot; an un-browserified module. Note that the type is
           &quot;text/node_module&quot;, and we give it a module id &quot;tests&quot; so that we can require
           it in other modules. Unlike JavaScript un-browserified modules are NOT loaded
           in the global scope.--&gt;
      &lt;script type=&quot;text/node_module&quot; id=&quot;tests&quot; src=&quot;./js/browsertest.js&quot;&gt;&lt;/script&gt;
    
      &lt;!-- You can also have inline un-browserified modules. Note that each script of type
           &quot;text/node_module&quot; is treated as a module and NOT loaded in the global scope
           like javascript scripts. --&gt;
      &lt;script type=&quot;text/node_module&quot; id=&quot;square&quot;&gt;
        module.exports = function(x) {
          return x * x
        }
      &lt;/script&gt;
    
      &lt;!-- You must include a module with id &quot;main&quot; which is the entry point to your 
            program. Both &quot;square&quot; and &quot;main&quot; module need not be inline.--&gt;
      &lt;script type=&quot;text/node_module&quot; id=&quot;main&quot;&gt;
    
        require(&quot;tests&quot;) // we just want to run the tests module
    
        var test = require(&quot;tape&quot;)
            square = require(&quot;square&quot;)
    
        test(&quot;Square Module Test&quot;, function(t) {
          t.plan(1)
          t.equal(square(10), 100)
        })
      &lt;/script&gt;
    
      &lt;!-- load-module.js must be the last script loaded --&gt;
      &lt;script type=&quot;text/javascript&quot; src=&quot;./js/load-module.js&quot;&gt;&lt;/script&gt;
    
    &lt;/body&gt;
    &lt;/html&gt;
