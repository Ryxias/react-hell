# Using Enzyme to test React Components

A simplified crash course

## Consideration: Configure the app and Include Enzyme
I did some wicked confusing crap in `EnzymeApplication.js`... I'll fill this part out eventually


## `shallow` vs `render` vs `mount`
The universal entry point to using `enzyme`.

For now, pretend `render` and `mount` don't exist and just use `shallow`.

The idea behind `shallow` is that it calls the `render()` operation of the current React component, but
does not render any nested React components returned by `render()`. Any further React components are simply
returned as-is without being expanded. This is useful because it doesn't automatically inherit the complexity
of sub-components, allowing you to just test the current component.

```javascript
import { shallow, render, mount } from 'enzyme';
const wrapper = shallow(<DisplayPane />);
```


## Locating Child Elements
Once you have a wrapper, you can use various finder methods to locate or isolate specific sub-components or
virtual DOM elements.

```javascript
const wrapper = shallow(<DisplayPane />);
const child_wrapper = wrapper.find('ChildComponent');
```


## Expanding Child Elements
To expand child components, use the wrapper's `find` methods to locate the individual child component
and then use `dive()`.

```javascript
const wrapper = shallow(<DisplayPane />);

const child_wrapper = wrapper.find('ChildComponent'); // This will only display <ChildComponent> however
wrapper.find('GrandchildComponent'); // Whoops! Finds nothing!

const child_stuff = child_wrapper.dive();
child_stuff.find('GrandchildComponent'); // Perfection.
```


## Printing the Virtualdom
Sometimes it's useful to display the entire virtual DOM (as currently "expanded" or not). The `debug()` method
works here.

```javascript
const wrapper = shallow(<DisplayPane />);

console.log(wrapper.debug()); // Displays the return value of DisplayPane.render()
console.log(wrapper.dive().debug()); // Displays DisplayPane.render(), but expands one additional level of child components
console.log(wrapper.dive().dive().dive().debug()); // and so on...
```


## Testing a Stateless Component
Because stateless components have no services and have all of their props pre-compiled, this is super easy
to do.

Import your component and create a wrapper a la `shallow`, `render`, or `mount`.

```javascript
const props = { ... };
const wrapper = shallow(<StatelessComponent {...props} />);

expect(wrapper.props().find('some element')).to.something;
```


## Testing a Container
This is hell of a lot harder than test because of dependency on global state. I don't have a good guide here yet
but I'm working on patterns that work.

For now, reference `QuestionPane.spec.js` I guess

One neat thing is you can use `.props()` to test what kinds of props the container derives from `mapStateToProps()`
which is real nice.

```javascript
const props = { ... };
const wrapper = shallow(<StatelessComponent {...props} />);

expect(wrapper.props()).to.something;
```


## CAVEATS

### Caveat #1: Watch out for wrapping Containers
Using `Radium()`, `connect()`, `injector()`, etc. actually wraps your implemented component in another Component.
This typically doesn't change how your application looks or behaves, but when it comes to `shallow()` these wrapping
containers will screw up how it looks.

```javascript
// Container.jsx
class Container extends React.PureComponent {}
export default inject(connect()(Container), {});

// ...

const wrapper = shallow(<Container />);

console.log(wrapper.debug()); // Only shows <Injector>
console.log(wrapper.dive().debug()); // Only shows <Connect>
console.log(wrapper.dive().dive().debug()); // Perfection.
```
