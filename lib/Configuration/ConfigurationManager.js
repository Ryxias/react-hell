'use strict';

/**
 * This class is primarily interested with collection and validation of server parameters. It ensures:
 *
 * 1) When the server boots, there aren't any missing critical parameters
 * 2) Code accessing the parameter will be warned when the parameter does not exist
 *
 * With this service, you should not need any global parameters nor the global config.
 *
 * The methods on this class can perform automatic deep lookups by delimiting keys with periods; for example:
 *
 *   service.getValue('mysql.host')
 *
 * This code will search
 */
class ConfigurationManager {
  constructor(raw_config) {
    this.config = raw_config;
    this.config.NODE_ENV = process.env.NODE_ENV;
  }

  /**
   * Returns the configuration at the specified path with no additional checks.
   *
   * @param configuration_node Period-delimited string
   */
  get(configuration_node) {
    return searchConfig(configuration_node, this.config);
  }

  /**
   * Fetches the configuration if it is an array, or errors if it is not.
   */
  getArray(configuration_node) {
    const maybe_array = this.get(configuration_node);
    if (!Array.isArray(maybe_array)) {
      throw new Error(`Could not load configuration under ${configuration_node}: Element is not array: ${maybe_array}`);
    }
    return maybe_array;
  }

  /**
   * Fetches the configuration if it is an object or dict, or errors if it is not.
   */
  getObject(configuration_node) {
    const maybe_dict = this.get(configuration_node);
    if (typeof maybe_dict !== 'object' || Array.isArray(maybe_dict)) {
      throw new Error(`Could not load configuration under ${configuration_node}: Element is not an object: ${maybe_dict}`);
    }
    return maybe_dict;
  }

  /**
   * Fetches the configuration if it is a primitive, or errors if it is not.
   */
  getValue(configuration_node) {
    const maybe_primitive = this.get(configuration_node);
    if (maybe_primitive === Object(maybe_primitive)) {
      throw new Error(`Could not load configuration under ${configuration_node}: Element is not a primitive: ${maybe_primitive}`);
    }
    return maybe_primitive;
  }
}

module.exports = ConfigurationManager;

// Private method
function searchConfig(full_path, config) {
  const path = full_path.split('.');
  let current_directory = 'Configuration base';
  let current_node = config;
  path.forEach(directory => {
    const valid_keys = Object.keys(current_node);
    if (!(directory in current_node)) {
      throw new Error(`No such configuration node: '${directory}' under '${current_directory}'. Valid keys were: ${valid_keys}`);
    }
    current_directory = directory;
    current_node = current_node[directory];
  });
  return current_node;
}
