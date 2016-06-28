# component-provider

`component-provider` offers extensibility across large Polymer applications with a very simple API.

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

## Credits
``component-provider`` was inspired by a similar solution which is being used internally at `YouTube`, specifically in their new re-designed version using Polymer.