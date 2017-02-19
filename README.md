# Dojo 2 core

[![Build Status](https://travis-ci.org/dojo/core.svg?branch=master)](https://travis-ci.org/dojo/core)
[![codecov.io](https://codecov.io/github/dojo/core/coverage.svg?branch=master)](https://codecov.io/github/dojo/core?branch=master)
[![npm version](https://badge.fury.io/js/%40dojo%2Fcore.svg)](https://badge.fury.io/js/%40dojo%2Fcore)

This package provides a set of language helpers, utility functions, and classes for writing TypeScript applications.
It includes APIs for feature detection, asynchronous operations, basic event handling,
and making HTTP requests.

**WARNING** This is *beta* software.  While we do not anticipate significant changes to the API at this stage, we may feel the need to do so.  This is not yet production ready, so you should use at your own risk.

## Installation

This package is currently in Beta with a initial stable release scheduled for later this year. You can download
the Beta by cloning or downloading this repository.

## Usage

### TypeScript

To access modules use after cloning or downloading the repository, you can reference it by:

```ts
import * as lang from 'src/lang'; // this imports all exports of the module as the object lang

import { lateBind, mixin } from 'src/lang'; // this imports lateBind and mixin from the module
```

### Compile To JavaScript

Once downloaded, you can compile the TypesScript files by first installing the project dependencies with:

```
npm install
```

Then by running this command:

```
grunt dev
```

This will run the grunt 'dev' task.

## Features

### Feature Detection

Using the latest Web technologies isn't always as straightforward as developers would like due to differing support
across platforms. [`@dojo/core/has`](docs/has.md) provides a simple feature detection API that makes it easy to
detect which platforms support which features.

### Language Utilities

The core package provides modules offering language utilities.  Some of these are heavily based
on methods in the ES2015 proposal; others are additional APIs for commonly-performed tasks.

#### array

The [`@dojo/core/array` module](docs/array.md) contains analogues to some of the ES2015 Array APIs.

#### lang

The [`@dojo/core/lang` module](docs/lang.md) contains various utility functions for tasks such as copying objects
and creating late-bound or partially applied functions.

### load
The [`@dojo/core/load` module](docs/load.md) can be used to dynamically load modules, or other arbitrary resources via plugins.

#### math

The [`@dojo/core/math` module](docs/math.md) contains analogues to a number of ES2015 APIs, including many trigonometric and logarithmic
functions.

#### string

The [`@dojo/core/stringExtras` module](docs/stringExtras.md) contains various string functions that are not available as part of the ES2015 String APIs.

#### UrlSearchParams

The [`@dojo/core/UrlSearchParams` class](docs/UrlSearchParams.md) can be used to parse and generate URL query strings.

#### Event handling

The [`@dojo/core/on` module](docs/on.md) contains methods to handle events across types of listeners.  It also includes methods to handle different event use cases including only firing
once and pauseable events.

#### HTTP requests

The [`@dojo/core/request` module](docs/request.md) contains methods to simplify making http requests. It can handle
making requests in both node and the browser through the same methods.

### Promises and Asynchronous Operations

#### Promise

The `@dojo/core/Promise` class is an implementation of the ES2015 Promise API that also includes static state
inspection and a `finally` method for cleanup actions.

`@dojo/core/async` contains a number of classes and utility modules to simplify working with asynchronous operations.

#### Task

The `@dojo/core/async/Task` class is an extension of `@dojo/core/Promise` that provides cancelation support.

## How do I contribute?

We appreciate your interest! Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme)
for the Contributing Guidelines and Style Guide.

Dojo core's continuous integration tests use the [BrowserStack](http://www.browserstack.com) cloud.

[![BrowserStack](resources/BrowserStackLogo.png)](http://www.browserstack.com)

## Licensing information

© 2004–2017 [JS Foundation](https://js.foundation/) & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.

Some string functions (`codePointAt`, `fromCodePoint`, and `repeat`) adopted from polyfills by Mathias Bynens,
under the [MIT](http://opensource.org/licenses/MIT) license.

See [LICENSE](LICENSE) for details.
