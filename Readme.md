# Omega Web Framework

A web application framework that is designed to support realtime web applications simply and effectively. It takes a
'batteries included, but optional' approach; it comes with a template language, database support, and an extensible
authentication system, but you are not required to use any of that. It also provides a
[django](https://www.djangoproject.com/)-like admin section that, when coupled with the built in database support,
alows you to inspect, modify, and create instances of your models. ( _Note: this feature is very new, and very
experimental; it is not recommended to use in production._ )

## Basic App

A basic omega application looks like this:

```javascript
var path = require('path');
var app = require('omega-wf').app;

app.router.add({url: '/static/*', path: path.join(__dirname, 'static')});

// Start the omega app.
app.listen();

```

This tells omega to serve the `./static` folder statically at the url `/static/*`, and then starts listening for incomming
connections. Admitedly, this isn't the most exciting application in the world, but it illustrates the basics of omega;
first and foremost: _omega is simple_. It tries to make whatever you're doing as straightforward as possible, and hide
any complexity from you.

Second, this demonstrates a core concept of working with omega: _the app is king_. omega plication object provides
an api into omega's functionality. Really, this should be intuitive for most people, but it's worth repeating.

## Static File Serving

The basic example also included a basic example of static file serving. Omega supports as many static files as you would
like, and handled directories, as well as individual files. To exand on the first example, we can also pass a list of
directories to serve:

```javascript
var path = require('path');
var app = require('omega-wf').app;

app.router.add(
    {
        url: '/static/*',
        path: path.join(__dirname, 'static')
    },
    {
        url: '/images/*',
        path: '/usr/share/images'
    },
    {
        url: '/uploads/*',
        path: '/tmp/uploads',
        options: {
            autoIndex: false
        }
);

```

The big difference between serving a static file, and serving a normal url route, is that omega looks for the `path` key
and assumes that anything with `path` is a static file. As `path` is not a HTTP verb, I feel this is safe.

### Options

Currently, the only option supported is `autoIndex`. If true, and the path requested is a directory, omega looks for an
`index.html` file, and serves that, instead.

### Security/Performance

Under the hood omega uses it's own custom static file router, which supports streaming. While the intention is for it to
be usable in production, a dedicated static file server, like [nginx](http://wiki.nginx.org/Main) will always be faster,
and more secure.

## URL Routing

Even though the focus of omega is on realtime web applications, there are reasons you may wish to do things a more
traditional way, with server-side processing. Or, perhaps, you need to write a simple `REST` service. That's easily done
with omega:

```javascript

var app = require('omega-wf').app;
var controllers = require('./controllers');

app.router.add({url: '/', get: controllers.index});

```

It also supports adding multiple paths, with multiple verbs at once:

```javascript

var app = require('omega-wf').app;
var controllers = require('./controllers');

app.router.add(
    {
        url: '/',
        get: controllers.index
    },
    {
        path: '/blog',
        get: controllers.blog_index,
        post: controllers.blog_new
    }
);

```

The `url` parameter can be a regular expression, supporting capture groups:

```javascript
app.router.add({url: '/blog/{slug}', get: controllers.blog});
```

In the `controllers.blog` function, you can get the url parameter like this:

```javascript
function(request, response) {
    var slug = request.params.slug;

    // Your code here
    response.end();
}
```

This is all simply a wrapper around [gett/router](https://github.com/gett/router), with a bit of syntactic sugar. All
HTTP verbs supported there are supported by omega.

## Socket.io

One of the big things omega provides is `socket.io` functionality. We expose this in a very straightforward way:

```javascript
var app = require('omega-wf').app;

app.sockets.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
```

Since `socket.io` has a great, easy to understand api, we don't even bother to wrap it; we just take care of starting
the server for you. (We don't expose the `io` object directly, as there's hardly any need. Should you need to use it,
you can access it via `app._io`.)

### Namespaces

We also expose socket.io's namespaces as `channels`:

```javascript
var app = require('omega-wf').app;

app.channels('/news').on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
});
```

This makes is nice and straightforward to write `socket.io` code however you wish.

## Authentication

Omega has integration with [Passport]() for authentication. This can be accessed through `require('omega-wf').auth`.
( _Note: This is one of the few pieces not wrapped in the omega app. This is because auth is considered optional._ )

Example to come soon.

## Databases

Omega has integration with [Sequelize]() for database connectivity. This can be accessed through `require('omega-wf').db`.
( _Note: This is one of the few pieces not wrapped in the omega app. This is because it is considered optional._ )

It should be noted that you are still free to use any ORM you wish; we just provide one for you incase you don't want to
integrate it yourself, and you like working with SQL. (`sqlite` is still the defacto development database in most
instances, which is why omega still defaults to sql over nosql solutions.)

Example to come soon.

## Admin Section

Omega now has an admin section, which can be enabled by simple uncommenting the following lines from the settings file:

```javascript
omegaAdminUrl = '/admin';
useOmegaAdmin = true;
```

As you can see, `omegaAdminUrl` allows you to control what url the admin section (and all it's associated static files,
REST interface, etc) is served at. This is simply to give you greater flexibility.

The admin section gives a very basic interface into your database, allowing you to easily create model instances, or
modify values in the database.

**Note:** Currently, the admin section has zero integration with the authentication system, and it gives complete access
to your database, so _**do not**_ enable it on a production site!

## Initialization

Sometimes, you need to do some initialization that depends on the omega app having finished it's setup. For these cases,
omega provides `app.init`:

```javascript
var app = require('omega-wf').app;

app.init(function() {
    // It is safe to work with app.config here.
});

// It is not safe to work with app.config here.

```

This is very useful if you want to split your app into several modules, some of which depend on configuration.

## App Name

It's possible to set the name of your application:

```javascript
var app = require('omega-wf').app;

app.setName("Some Really Cool App v2.0.1.adf23019w-pre7");
```

This is useful for logging, mostly. (But it might get used later. Suggestions welcome!)

## Unit Tests

Tests can be run with:

```bash
$ npm tests
```

## Installation

Simply install globally from npm:

```bash
$ npm install -g omega-wf
```

This will get you the `omega-admin` script, with which you can start a new app:

```bash
$ omega-admin startapp my_app
```

(You can also install it locally, but then you won't get the omega admin script.)

## Work in Progress

This is a massive work in progress. Currently, I'm gearing up for a 1.0 release. The API is mostly stable, and I'm using
it to develop some projects. As I find issues, I am documenting them with github issues, and then fixing them, so the
issues list is a good idea of what doesn't work.

At the moment, I would call it "beta quality", and wouldn't run it in production without doing some extensive testing. If,
however, you are a brave soul, and are using it in production, let me know! The more feedback, the better.
