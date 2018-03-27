'use strict';

const BaseError = require('../Error/BaseError');

/**
 * Sequelize has an interesting quirk where each model has no concrete type; instead Models have implicit
 * types that are strongly tied to the sequelize database connection and the sequelize model definitions.
 *
 * This service implements an easy "instanceOf" kind of logic
 */
class ModelValidator {
  constructor(ConnectionManager) {
    this.ConnectionManager = ConnectionManager;
  }

  /**
   * Syntactic sugar. You can use it like this:
   *
   * if (ModelValidator.thisObject(user).isA('User')) {
   *   // ...
   * }
   *
   * @param object
   * @returns {{isA: (function(this:ModelValidator))}}
   */
  thisObject(object) {
    const isA = this.isA.bind(this);
    return {
      isA: model_name => isA(object, model_name),
      enforce: model_name => {
        if (!isA(object, model_name)) {
          throw new BaseError('Type enforcement failed.', '60001IIMPLBWYQNW');
        }
      }
    }
  }

  /**
   * Verifies whether the given object is a valid instance of the given sequelize model name.
   *
   * @param object
   * @param model_name
   */
  isA(object, model_name) {
    return object instanceof this.ConnectionManager.get(model_name).Instance;
  }
}
module.exports = ModelValidator;
