# Issue: CSS Refactoring to React-Bootstrap

## Revision History

| Date | Description | Author |
| :--- | ----------- | ------ |
| 10/26/2017 | Created documentation for the first time using Markdown. *Work in progress.* | David Zou |

## Table of Contents

[**1. Introduction**] (#introduction)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.1 Purpose] (#purpose)    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.2 Scope] (#scope)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1.3 References] (#references)  
[**2. Current Issues**] (#current-issues)  
[**3. Requirements**] (#requirements)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.1 Goals] (#goals)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3.2 Constraints] (#constraints)  
[**4. Proposal**] (#proposal)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.1 Overview] (#proposal-overview)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.2 Implementation] (#implementation)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.3 Execution] (#execution)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4.4 Contingency Measures] (#contingency)  
[**5. Other Thoughts**] (#other-thoughts)  

## <a name="introduction"></a> 1. Introduction

#### <a name="purpose"></a> 1.1 Purpose

This document provides a comprehensive overview of the current UI state of the React single page application ([chuuni.me] (https://chuuni.me)) and its problems.  It will also outline our requirements for the app as well as a proposal plan on how to migrate our codebase into **React-Bootstrap**.  This document's purpose is also used to practice ***Markdown*** and ***technical documentation skills*** that are essential to a software engineer's skillset.

#### <a name="scope"></a> 1.2 Scope

This document will be covering all of the React components that rely on regular Bootstrap to render usable and aesthetically-pleasing GUI to the DOM in [chuuni.me] (https://chuuni.me).  

#### <a name="references"></a> 1.3 References

The following references were used as knowledgebases for this project:

* [React-Bootstrap - GUI Refactorization] (https://react-bootstrap.github.io/)
* [Markdown - Documentation Building] (https://daringfireball.net/projects/markdown/)
* [Example Technical Documentation - Software Architecture Document] (http://www.ecs.csun.edu/~rlingard/COMP684/Example2SoftArch.htm)

## <a name="current-issues"></a> 2. Current Issues

Issues with the current design and flow of the site's UI are as follows:

1. **Mandatory Usage of jQuery**: The problem with using jQuery alongside with React is the way both handle events on the DOM; jQuery relies on changes of already rendered elements on the DOM, while React relies on the virtual DOM to manage events.  If jQuery were to affect the states of the virtual DOM, it can potentially cause unpredictable outcomes (loops/disruption of component lifecycle, unexpected changes to states, etc.).  CSS that does not necessarily need to rely on jQuery would be the best route to go if the app were to get bigger as we start adding more libraries or UI animations/features.  jQuery can also be a potential performance issue, as React is already has its own way of optimizing DOM operations by separating the process of DOM 
2. **Unnecessarily long and verbose tags caused by CSS classes**: Twitter Bootstrap is great and easy to use because all you need to do to add style to your DOM elements is by inserting predefined classes from their framework.  Unfortunately, that is also a double-edge blade; as you start adding more styles to an element using their framework, the class attribute can start to get cluttered and it gets harder to keep track of the CSS that is used in those elements.  That also makes it harder to debug a CSS conflict if there ever is one.

## <a name="requirements"></a> 3. Requirements

#### <a name="goals"></a> 3.1 Goal(s)

The goal of this project is to refactor our entire CSS system from Twitter-Bootstrap to React-Bootstrap, which conforms more to React's philosophy that each distinct functionality within the page is compartmentalized into their own individual & lightweight parts.  The refactor will also clean up code and removes dependence on jQuery for transitions and event handling for certain parts of the UI.  Furthermore, by getting rid of jQuery and refactoring to React-Bootstrap, it will rid our application's reliance on jQuery's imperative programming style and therefore supports React's philosophy of *declarative programming*.

#### <a name="constraints"></a> 3.2 Constraint(s)

React-Bootstrap is a front-end framework; Because they are frameworks, developers can be constrained to using their predefined styles in order not to cause any conflicts with their own customized styles.  To deviate from the Bootstrap framework would sometimes require overriding styles, which can make UI debugging a little more difficult, so it would be best to avoid that as much as possible.  Some may argue, however, that this reinforces UI uniformity throughout the application.

## <a name="proposal"></a> 4. Proposal

#### <a name="proposal-overview"></a> 4.1 Overview

As our React application is still very young, it is not impossible to successfully refactor our entire front-end codebase to use React-Bootstrap.  Since a variant of Twitter-Bootstrap was previously used (Material Design Bootstrap), some animations and transitions may become incompatible and may have to be replaced with something else similar and available in the React-Bootstrap framework.

#### <a name="implementation"></a> 4.2 Implementation

To set up React-Bootstrap, one may use `npm` or `bower` to install.  In our case, since we are currently using node, we will use `npm`:

    npm install --save react-bootstrap

 `index.html` will still require the CSS stylesheet(s) provided by Twitter-Bootstrap:

``` 
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```

Optional themed stylesheets may also be used on top of the main stylesheet (i.e. regular theme, Material Design, etc.).  Instructions for installing the optional themes vary from variant to variant, so please follow the installation instructions on the theme's main website.

Other than that, everything else should have been installed already from setting up React (i.e. Babel).

**Note**: React-Bootstrap has not been thoroughly tested against IE8 due to their team's efforts to move towards more *modern browsers*.  Polyfills may be required for browsers incompatible with ES5.

#### <a name="execution"></a> 4.3 Execution

The current CSS stylesheets do not need to be completely reworked if at all.  Most of the changes to be made will be within the JSX code in the `render()` functions, in particular the removal of `className` attributes of each JSX element and replace them with syntax corresponding to React-Bootstrap requirements. For example, as taken from the main site of React-Bootstrap:

	<button id="something-btn" type="button" class="btn btn-success btn-sm">  
	  Something
	</button>

Will be converted to this:

    <Button bsStyle="success" bsSize="small" onClick={someCallback}>
      Something
    </Button>

As you can see, the syntax is clearer and cleaner with React-Bootstrap.

#### <a name="contingency"></a> 4.4 Contingency Measures

There are several options to rollback to a working state of the application if it were to malfunction due to the changes:

* Rollback to previous working commit with Twitter-Bootstrap and find another CSS design framework/library
* Scrap Bootstrap and start using plain CSS



## <a name="other-thoughts"></a> 5. Other Thoughts

Another thought I had was that we may also consider just using **plain modern CSS**; the reason again being that all Bootstrap variants are essentially front-end **frameworks**.  Using plain CSS would provide the most flexibility for front-end development, but it would be more time-consuming as everything would have to be built up from scratch.  However, time is not really of the essence for this kind of project and that is why this is still a viable choice.  It also leaves room for CSS skill improvement and a better understanding of how modern CSS works.