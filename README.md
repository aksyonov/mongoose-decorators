# mongoose-decorators [![Build Status][travis-image]][travis-url]
Decorators for mongoose models.

## Installation

```
$ npm i mongoose mongoose-decorators --save
```

## Usage

This library supports [ECMAScript decorators proposal][decorators-url]. To use decorators with babel you need to add [transform-decorators-legacy][transform-decorators-legacy-url] plugin to `.babelrc`.

Example:

```js
import {model, index, post} from 'mongoose-decorators';

@model({
  name: String,
  type: String
}, {
  autoIndex: false
})
@index({name: 1, type: -1})
export default class User {
  // class methods
  foo() {}

  @post('save')
  reindex() {}
}
```

### `model(definition, options, configure)`

- `definition` (object) - will be passed to [mongoose.Schema][mongoose-schema-url] constructor
- `options` (object, optional) - will be passed to [mongoose.Schema][mongoose-schema-url] constructor
- `configure` (function, optional) - function for configuring schema. Some schema methods (create indexes, register plugins, etc.) should be called before model is created, you can do it in this function. It will be called with one argument - mongoose schema.

### `index`, `plugin`

Decorators that wrap common used mongoose schema methods with the same options. These decorators must be used between `model` decorator and class definition.

### `pre`, `post`

Method decorators that register [middleware][mongoose-middleware].

## License
This library is under the [MIT License][mit-url]


[travis-image]: https://img.shields.io/travis/aksyonov/mongoose-decorators/master.svg
[travis-url]: https://travis-ci.org/aksyonov/mongoose-decorators
[decorators-url]: https://github.com/wycats/javascript-decorators
[transform-decorators-legacy-url]: https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
[mongoose-schema-url]: http://mongoosejs.com/docs/guide.html#definition
[mongoose-middleware]: http://mongoosejs.com/docs/middleware.html
[mit-url]: http://opensource.org/licenses/MIT
