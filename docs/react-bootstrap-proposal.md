# Issue: CSS Refactoring to React-Bootstrap/Removal of jQuery from React App

## Revision History

| Date | Description | Author |
| :--- | ----------- | ------ |
| 10/26/2017 | Created documentation for the first time using Markdown. *Work in progress.* | David Zou |
| 10/29/2017 | Included more information about the refactoring of the gacha game after removal of jQuery. Change in title. | David Zou |

## Table of Contents

[**1. Introduction**](#introduction)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.1 Purpose](#purpose)    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.2 Scope](#scope)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.3 References](#references)  
[**2. Current Issues**](#current-issues)  
[**3. Requirements**](#requirements)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.1 Goals](#goals)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.2 Constraints](#constraints)  
[**4. Proposal**](#proposal)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.1 Overview](#proposal-overview)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.2 Implementation](#implementation)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.2.1 React-Bootstrap](#implementation-react-bootstrap)  
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.2.2 CSS Transitions](#implementation-css-transitions)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.3 Execution](#execution)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.4 Contingency Measures](#contingency)  
[**5. Other Thoughts**](#other-thoughts)  

## <a name="introduction"></a> 1. Introduction

#### <a name="purpose"></a> 1.1 Purpose

This document provides a comprehensive overview of the current UI state of the React single page application ([chuuni.me](https://chuuni.me)) and its problems.  It will also outline our requirements for the app as well as a proposal plan on how to migrate our codebase into **React-Bootstrap** and completely replace jQuery animations with **CSS transitions**.  This document's purpose is also used to practice ***Markdown*** and ***technical documentation skills*** that are essential to a software engineer's skillset.

#### <a name="scope"></a> 1.2 Scope

This document will be covering all of the React components that rely on regular Bootstrap to render usable and aesthetically-pleasing GUI to the DOM in [chuuni.me](https://chuuni.me).  This will also cover that game state transitions due to its current dependence on jQuery.

#### <a name="references"></a> 1.3 References

The following references were used as knowledgebases for this project:

* [React-Bootstrap - Used for GUI Refactorization](https://react-bootstrap.github.io/)
* [Markdown - Documentation Building](https://daringfireball.net/projects/markdown/)
* [Example Technical Documentation - Software Architecture Document](http://www.ecs.csun.edu/~rlingard/COMP684/Example2SoftArch.htm)
* [Medium Blog: UI Animations with React — The Right Way](https://medium.com/@joethedave/achieving-ui-animations-with-react-the-right-way-562fa8a91935)
* [MDN - Transition API Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)  
* [MDN - Transition-Delay API Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay)
* [MDN - Using CSS Transitions Article](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
* [React Animation Add-ons - ReactCSSTransitionGroup Documentation](https://reactjs.org/docs/animation.html)

## <a name="current-issues"></a> 2. Current Issues

Issues with the current design and flow of the site's UI are as follows:

1. **Mandatory Usage of jQuery**: The problem with using jQuery alongside with React is the way both handle events on the DOM; jQuery relies on changes of already rendered elements on the DOM, while React relies on the virtual DOM to manage events.  If jQuery were to affect the states of the virtual DOM, it can potentially cause unpredictable outcomes (loops/disruption of component lifecycle, unexpected changes to states, etc.).  CSS that does not necessarily need to rely on jQuery would be the best route to go if the app were to get bigger as we start adding more libraries or UI animations/features.  jQuery can also be a potential performance issue, as React is already has its own way of optimizing DOM operations; jQuery is not a lightweight library either, costing client download time.
2. **Unnecessarily long and verbose tags caused by CSS classes**: Twitter Bootstrap is great and easy to use because all you need to do to add style to your DOM elements is by inserting predefined classes from their framework.  Unfortunately, that is also a double-edge blade; as you start adding more styles to an element using their framework, the class attribute can start to get cluttered and it gets harder to keep track of the CSS that is used in those elements.  That also makes it harder to debug a CSS conflict if there ever is one.

## <a name="requirements"></a> 3. Requirements

#### <a name="goals"></a> 3.1 Goal(s)

The goal of this project is to refactor our entire CSS system from Twitter-Bootstrap to React-Bootstrap, which conforms more to React's philosophy that each distinct functionality within the page is compartmentalized into their own individual & lightweight parts.  For example, removing the Gacha game's reliance on jQuery will possibly allow us to break the game down into further stateless sub-components.  Breaking down code into smaller parts will also allow for much easier testing. 

The refactor will also clean up code and removes dependence on jQuery for transitions and event handling for certain parts of the UI.  Furthermore, by getting rid of jQuery and refactoring to React-Bootstrap, it will rid our application's reliance on jQuery's imperative programming style and therefore supports React's philosophy of *declarative programming*.  In other words, having less reliance on jQuery or any other libraries/frameworks that directly manipulate the DOM will keep things simpler, easier to reason, and make us run into less problems.

#### <a name="constraints"></a> 3.2 Constraint(s)

React-Bootstrap is a front-end framework; Because they are frameworks, developers can be constrained to using their predefined styles in order not to cause any conflicts with their own customized styles.  To deviate from the Bootstrap framework would sometimes require overriding styles, which can make UI debugging a little more difficult, so it would be best to avoid that as much as possible.  Some may argue, however, that this reinforces UI uniformity throughout the application.

Another constraint would be the Gacha game itself: we should be able to retain all functionality of not just the site's UI, but the game animation states intact as well after removing jQuery.

## <a name="proposal"></a> 4. Proposal

#### <a name="proposal-overview"></a> 4.1 Overview

As our React application is still very young, it is not impossible to successfully refactor our entire front-end codebase to use React-Bootstrap.  Since a variant of Twitter-Bootstrap was previously used (Material Design Bootstrap), some animations and transitions may become incompatible and may have to be replaced with something else similar and available in the React-Bootstrap framework.

We will also be replacing the game state animation reliance of the Gacha page as well from jQuery to [CSS transitions](https://medium.com/@joethedave/achieving-ui-animations-with-react-the-right-way-562fa8a91935).  This will require us to do some work on current customized stylesheets.  For example, the ones that will include the game state transitions.

#### <a name="implementation"></a> 4.2 Implementation

##### <a name="implementation-react-bootstrap"></a> 4.2.1 React-Bootstrap

To set up React-Bootstrap, one may use `npm` or `bower` to install.  In our case, since we are currently using node, we will use `npm`:

    npm install --save react-bootstrap

 `index.html` will still require the CSS stylesheet(s) provided by Twitter-Bootstrap:

``` 
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```

Optional themed stylesheets may also be used on top of the main stylesheet (i.e. regular theme, Material Design, etc.).  Instructions for installing the optional themes vary from variant to variant, so please follow the installation instructions on the theme's main website.

Other than that, everything else should have been installed already from setting up React (i.e. Babel).

API Documentation of the available Bootstrap components can be found [here](https://react-bootstrap.github.io/components.html).

**Note**: React-Bootstrap has not been thoroughly tested against IE8 due to their team's efforts to move towards more *modern browsers*.  Polyfills may be required for browsers incompatible with ES5.

##### <a name="implementation-css-transitions"></a> 4.2.2 CSS Transitions

Most modern browsers should come with support for CSS transitions.  The following CSS properties will be used to help with the refactoring:

* `transition`: used for CSS transitions. Syntax is as follows (taken from MDN API documentation): 
 
```
    /* Apply to 1 property */
    /* property name | duration */
    transition: margin-right 4s;
    
    /* property name | duration | delay */
    transition: margin-right 4s 1s;

    /* property name | duration | timing function */
    transition: margin-right 4s ease-in-out;

    /* property name | duration | timing function | delay */
    transition: margin-right 4s ease-in-out 1s;
    
    /* Apply to 2 properties */
    transition: margin-right 4s, color 1s;
    
    /* Apply to all changed properties */
    transition: all 0.5s ease-out;
    
    /* Global values */
    transition: inherit;
    transition: initial;
    transition: unset;
```

* `transition-delay`: used in conjunction with `height` set to `0` to fix the issue with white space after hiding an element with `visibility`
* `opacity`: `0` to `1.0` value, responsible for fade animations 
* `visibility`: can be set to `visible` or `hidden`, responsible for removing click and hover events
* `height`: (set to zero) 

Examples of usage can be found in [Medium Blog: UI Animations with React — The Right Way](https://medium.com/@joethedave/achieving-ui-animations-with-react-the-right-way-562fa8a91935).  The article also further explains the several nuances and problems of using CSS transitions and how to circumvent them.

`ReactCSSTransitionGroup` components may be needed for transitions prior to the mounting or unmounting step of the React component lifecycle.  This is because the process of mounting/unmounting may finish before the CSS transitions even have a chance to kick in.  Use `npm` to install onto the project directory:

`npm install react-transition-group@1.x --save`

You may also use an external CDN instead to add in `index.html`:

`https://unpkg.com/react-transition-group/dist/react-transition-group.min.js`

To add the package to your React components:

`import ReactCSSTransitionGroup from 'react-addons-css-transition-group';`

Examples of `ReactCSSTransitionGroup` usage can be found in the same blog article above.

**Note**: CSS transitions are fairly new and may gracefully fail on incompatible browsers.  Therefore, we will need to check the user-agent and disable the game notifying the user to switch to a more modern browser if it is trying to run on such worst scenario.

#### <a name="execution"></a> 4.3 Execution

Most of the changes to be made will be within the JSX code in the `render()` functions, in particular the removal of `className` attributes of each JSX element and replace them with syntax corresponding to React-Bootstrap requirements. For example, as taken from the main site of React-Bootstrap:

	<button id="something-btn" type="button" class="btn btn-success btn-sm">  
	  Something
	</button>

Will be converted to this:

    <Button bsStyle="success" bsSize="small" onClick={someCallback}>
      Something
    </Button>

As you can see, the syntax is clearer and cleaner with React-Bootstrap.

Some of the components will require further reworking due to their use of jQuery.  For example, the Gacha page uses jQuery for much of its animations and game event handling.  For this reason, the refactoring will be split into three stages in the following order:

1. Refactor the Bootstrap Code
2. Replacement of jQuery for certain animations to CSS transitions
3. Complete dependence removal of jQuery

Step 2 will require the most work, as that will require tinkering with animations for both Bootstrap components and game states of Gacha.

#### <a name="contingency"></a> 4.4 Contingency Measures

There are several options to rollback to a working state of the application Bootstrap UI if it were to malfunction due to the changes:

* Rollback to previous working commit(s) with Twitter-Bootstrap and find another CSS design & animation framework/library
* Completely scrap Bootstrap and start using plain & modern CSS/Transitions

Since this refactoring has been broken down into three stages, we should be able to gracefully rollback without wasting hours of work on obsessively large commits and instead go back one step at a time.  Even if React-Bootstrap were to not work out, refactoring to CSS transitions will still be viable and relevant for the Gacha game.

## <a name="other-thoughts"></a> 5. Other Thoughts

Another thought I had was that we may also consider just using **plain modern CSS**; the reason again being that all Bootstrap variants are essentially front-end **frameworks**.  Using plain CSS would provide the most flexibility for front-end development, but it would be more time-consuming as everything would have to be built up from scratch.  However, time is not really of the essence for this kind of project and that is why this is still a viable choice.  It also leaves room for CSS skill improvement and a better understanding of how modern CSS works.