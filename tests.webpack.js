const context = require.context('./tests/karma', true, /-test\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
