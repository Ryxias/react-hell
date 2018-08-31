'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

/**
 * MODULES:
 *
 *  In NodeJS, you'll commonly see the syntax for "export XYZ..." or "module.exports = XYZ..."
 *  What's the idea? For each FILE, you define a "thing" that the FILE is exporting.
 *
 *  When you want to reuser this "thing" in a different file, you use "import XYZ ..." or
 *  "require('XYZ.js')", to pull in the exported "thing".
 *
 *  In this file's case, it's exporting a FUNCTION. It hard to recognize due to the arrow syntax;
 *
 *    (service_container, sequelize) => {
 *      // ... code goes here
 *    }
 *
 *  Is actually almost equivalent to:
 *
 *    function createSequelizeCommentDefinition(service_container, sequelize) {
 *      // ... code goes here
 *    }
 *
 *  Reading on ES6 Arrow Syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 *
 *  This module exports a function that generates a Sequelize definition. It gets really complex so don't worry about
 *  how this stuff works for now. The function is used by a class called the "ConnectionManager", which stores all
 *  model definitions + connection(s) to database(s).
 */
module.exports = (service_container, sequelize) => {

  /**
   * This is the actual definition.
   *
   * The sequelize parameter that is passed into the function acts kind of like a database connection.
   * The sequelize.define() method is used to register a model definition to that specific connection.
   *
   * Once properly registered, sequelize will know to associate queries with this table "comments" with
   * the below definition. It will automatically translate all data pulled from this table into Comment
   * objects.
   */
  const Comment = sequelize.define('comment', {

    /**
     * Here is you add "interesting stuff" to the definition. Each one of these fields is called a "column"
     */
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(255),
      allowNull: true,
    },
    text: {
      type: STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'comments',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [],
    hooks: {},
  });

  Comment.prototype.getUsername = function() {
    return this.username;
  };

  Comment.prototype.getText = function() {
    return this.text;
  };

  return Comment;
};
