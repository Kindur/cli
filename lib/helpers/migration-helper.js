'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sequelize = _index2.default.generic.getSequelize();

module.exports = {
  getTableName(modelName) {
    return Sequelize.Utils.pluralize(modelName);
  },

  generateTableCreationFileContent(args) {
    var tableName = this.getTableName(args.name);
    var attributes = _index2.default.model.transformAttributes(args.attributes);
    var createdAt = 'createdAt';
    var updatedAt = 'updatedAt';

    if (args.paranoid) {
      attributes.push({ fieldName: 'deletedAt', dataType: 'date' });
    }

    if (args.underscored) {
      createdAt = 'created_at';
      updatedAt = 'updated_at';
      tableName = Sequelize.Utils.underscore(tableName);
      attributes = attributes.map(function (attribute) {
        var fieldName = Sequelize.Utils.underscore(attribute.fieldName);
        return _extends({}, attribute, { fieldName });
      });
    }
    return _index2.default.template.render('migrations/create-table.js', { tableName, attributes, createdAt, updatedAt });
  },

  generateMigrationName(args) {
    return _lodash2.default.trimStart(_lodash2.default.kebabCase('create-' + args.name), '-');
  },

  generateTableCreationFile(args) {
    var migrationName = this.generateMigrationName(args);
    var migrationPath = _index2.default.path.getMigrationPath(migrationName);

    _index2.default.asset.write(migrationPath, this.generateTableCreationFileContent(args));
  }
};