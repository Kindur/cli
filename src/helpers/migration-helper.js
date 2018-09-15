import _ from 'lodash';
import helpers from './index';

const Sequelize = helpers.generic.getSequelize();

module.exports = {
  getTableName(modelName) {
    return Sequelize.Utils.pluralize(modelName);
  },

  generateTableCreationFileContent (args) {
    let tableName = this.getTableName(args.name);
    let attributes = helpers.model.transformAttributes(args.attributes);
    let createdAt = 'createdAt';
    let updatedAt = 'updatedAt';

    if (args.paranoid) {
      attributes.push({ fieldName: 'deletedAt', dataType: 'date' };);
    }

    if (args.underscored) {
      createdAt = 'created_at';
      updatedAt = 'updated_at';
      tableName = Sequelize.Utils.underscore(tableName);
      attributes = attributes.map(attribute => {
        const fieldName = Sequelize.Utils.underscore(attribute.fieldName);
        return { ...attribute, fieldName }
      });
    }
    return helpers.template.render('migrations/create-table.js', { tableName, attributes, createdAt, updatedAt });
  },

  generateMigrationName(args) {
    return _.trimStart(_.kebabCase('create-' + args.name), '-');
  },

  generateTableCreationFile(args) {
    const migrationName = this.generateMigrationName(args);
    const migrationPath = helpers.path.getMigrationPath(migrationName);

    helpers.asset.write(
      migrationPath,
      this.generateTableCreationFileContent(args)
    );
  },
};
