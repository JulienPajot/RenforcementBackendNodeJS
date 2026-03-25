const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sinister extends Model {
    static associate(models) {
      Sinister.belongsTo(models.Document, { foreignKey: 'cni_driver', as: 'cniDocument' });
      Sinister.belongsTo(models.Document, { foreignKey: 'vehicule_registration_certificate', as: 'registrationDocument' });
      Sinister.belongsTo(models.Document, { foreignKey: 'insurance_certificate', as: 'insuranceDocument' });
      Sinister.hasMany(models.Request, { foreignKey: 'sinister_id', as: 'requests' });
    }
  }

  Sinister.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      plate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver_firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver_lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver_is_insured: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      call_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sinister_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      context: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      driver_responsability: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      driver_engaged_responsability: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cni_driver: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },
      vehicule_registration_certificate: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },
      insurance_certificate: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Sinister',
      tableName: 'sinister',
      timestamps: false,
    }
  );

  return Sinister;
};
