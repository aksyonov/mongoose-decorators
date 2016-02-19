import mongoose from 'mongoose';
import sinon from "sinon";
import {model, index, plugin, post, pre} from '../src/';

beforeEach(() => {
  mongoose.models = {};
});

describe('@model', () => {
  it('should return mongoose model', () => {
    @model({name: String})
    class User {
      foo() {}
    }

    expect(User.modelName).to.eql('User');
    expect(User).to.respondTo('foo');
  });

  it('should register static methods in model', function () {
    @model({name: String})
    class User {
      static register() {}
    }

    expect(User).itself.to.respondTo('register');
  });

  it('should register instance methods in model', function () {
    @model({name: String})
    class User {
      encryptPassword() {}
    }

    expect(User).to.respondTo('encryptPassword');
  });

  it('should register getters in model', function () {
    @model({name: String})
    class User {
      get password() { return 'encrypted'; }
    }

    expect(new User().password).to.eql('encrypted');
  });

  it('should register setters in model', function () {
    @model({name: String})
    class User {
      set password(value) { this._pass = value; }
    }
    let user = new User({password: 'pass'});

    expect(user._pass).to.eql('pass');
  });

  it('should accept schema options', () => {
    @model({name: String}, {collection: 'data'})
    class User {}

    expect(User.schema.options.collection).to.eq('data');
  });

  it('should configure model', () => {
    @model({
      name: String
    }, schema => {
      schema.method('bar', () => {});
    })
    class User {}

    expect(User).to.respondTo('bar');
  });

  it('should accept options and configure method at the same time', () => {
    @model({
      name: String
    }, {
      collection: 'data'
    }, schema => {
      schema.method('bar', () => {});
    })
    class User {}

    expect(User.schema.options.collection).to.eq('data');
    expect(User).to.respondTo('bar');
  });
});

describe('@index', () => {
  it('should register compound index', () => {
    @model({name: String, email: String})
    @index({name: 1, email: -1})
    class User {}

    expect(User.schema._indexes[0][0]).to.eql({name: 1, email: -1});
  });
});

describe('@plugin', () => {
  it('should register plugin', () => {
    const testPlugin = sinon.spy();
    @model({name: String, email: String})
    @plugin(testPlugin)
    class User {}

    expect(testPlugin).to.have.been.calledWith(User.schema);
  });
});

describe('@pre, @post', () => {
  it('should register function as hook', () => {
    const testHook = sinon.spy(next => next());
    @model({name: String, email: String})
    @pre('validate', testHook)
    class User {}

    for (let i = 0; i < 2; i++) new User({name: 'Jon'}).validate();

    expect(testHook).to.have.been.calledTwice;
  });

  it('should register class method as hook', (done) => {
    @model({name: String, email: String})
    @post('validate', 'hook')
    class User {
      hook() {
        this.validated = true;
      }
    }

    let user = new User({name: 'Jon'});
    user.validate(() => {
      expect(user.validated).to.be.true;
      done();
    });
  });

  it('should decorate a method', (done) => {
    @model({name: String, email: String})
    class User {
      @post('validate')
      hook() {
        this.validated = true;
      }
    }

    let user = new User({name: 'Jon'});
    user.validate(() => {
      expect(user.validated).to.be.true;
      done();
    });
  });
});
