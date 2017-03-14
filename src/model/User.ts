let bookshelf = require('../database/bookshelf');

let User = bookshelf.Model.extend({
    tableName: 'user'
});

module.exports = User;