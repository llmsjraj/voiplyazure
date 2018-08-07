module.exports = function(context) {
    var app = context.bindings.app;
    context.done(null, `Hello ${context.bindings.name}!`);
};