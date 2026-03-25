const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      Document.hasMany(models.Sinister, { foreignKey: 'cni_driver', as: 'sinistersCni' });
      Document.hasMany(models.Sinister, { foreignKey: 'vehicule_registration_certificate', as: 'sinistersRegistration' });
      Document.hasMany(models.Sinister, { foreignKey: 'insurance_certificate', as: 'sinistersInsurance' });
      Document.hasMany(models.Request, { foreignKey: 'diagnostic_report_file', as: 'requestsDiagnostic' });
      Document.hasMany(models.Request, { foreignKey: 'case1_contractor_invoice', as: 'requestsInvoice' });
      Document.hasMany(models.Request, { foreignKey: 'case2_insured_rib', as: 'requestsRib' });
    }
  }

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('CNI', 'REGISTRATION', 'INSURANCE', 'REPORT', 'INVOICE', 'RIB', 'OTHER'),
        allowNull: false,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'document',
      timestamps: false,
    }
  );

  return Document;
};
