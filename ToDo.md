# Omega ToDo:

## Project Cleanup
 - ~~Remove the db support. (This is now provided by the optional omega-models project.)~~
 - ~~Remove the admin section. (This will be provided in the future by a project that uses omega-models.)~~
 - ~~Upgrade to latest swig.~~
 - Convert unit tests over to mocha.
 - If there is a failure to start, we need to print an error, not simply exit.

## Project template
 - Have several project templates:
     - Minimal: A single-file omega app, with templated npm stuff.
     - Slim: A slim project with a few files, as a good no-frills starting point for typical omega apps.
     - Full: A fully opinionated project, complete with standard project layout, and common dependencies.
     - Bootstrap: Full, but with grunt and bootstrap already integrated.
 - Switch to using a github project to pull these template files from. We will clone/download the template, then run our processing on it, and delete the `.git` directory.

## Config system
 - Either switch to a minimal config system (like the lsdg-lights project) or make the settings stuff run in `this context`.
 - Make sure it's simple, clean, and works as expected.

## Static
 - ~~We really shouldn't be shipping our own static files with omega. Most projects will want their own versions; our templates can use a cdn for the files they need.~~
 - ~~Update to the latest bootstrap, with our own theme.~~

## App
 - We need to clean up the app code so that it's lighter weight, and so that you don't have to import `omega-wf` everywhere. The API could really stand to be improved.

