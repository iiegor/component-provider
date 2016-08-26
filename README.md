# component-provider

`component-provider` offers extensibility across large Polymer applications with a very simple API.

## Install
```shell
$ bower i --save iiegor/component-provider
```

## Usage

Let's say our application entry component is called `app-shell` and has the following code:

```javascript
Polymer({
    is: 'app-shell',
    
    showAlert(str) {
        alert(str);
    }
});
```

`component-provider` can be integrated very easily into our component doing the following:

```javascript
/**
 * The app-shell interface
 */
function ApplicationShellInterface() { }
ApplicationShellInterface.prototype.showAlert = function() { };

/**
 * Component
 */
Polymer({
    is: 'app-shell',
    provides: ApplicationShellInterface,
    behaviors: [Behaviors.ComponentBehavior],
    
    showAlert(str) {
        alert(str);
    }
});
```

Now that the ``app-shell`` methods are exposed, we can call them from another component like this:

```javascript
Polymer({
    is: 'another-component',
    behaviors: [Behaviors.ComponentBehavior],
    
    ready() {
        this.getInterface(ApplicationShellInterface).showAlert('This is amazing!');
    }
});
```

**Note:** Remember that you'll need to import the element to be able to *provide* an interface or use the *ComponentBehavior*.

```html
<link rel="import" href="bower_components/component-provider/component-provider.html">
```

See the [demo](https://github.com/iiegor/component-provider/blob/master/demo/index.html) to have a more clearer idea of how to use *component-provider*.

## Credits
``component-provider`` was inspired by a similar solution which is being used internally at `YouTube`, specifically in their new re-designed version using Polymer.
