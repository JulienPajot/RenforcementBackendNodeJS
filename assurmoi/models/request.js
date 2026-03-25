const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.Sinister, { foreignKey: 'sinister_id', as: 'sinister' });
      Request.belongsTo(models.Document, { foreignKey: 'diagnostic_report_file', as: 'diagnosticReport' });
      Request.belongsTo(models.Document, { foreignKey: 'case1_contractor_invoice', as: 'contractorInvoice' });
      Request.belongsTo(models.Document, { foreignKey: 'case2_insured_rib', as: 'insuredRib' });
    }
  }

  Request.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sinister_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'sinister', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'IN_PROGRESS',
          'EXPERTISE_PLANNED',
          'EXPERTISE_DONE',
          'REPAIR_PLANNED',
          'REPAIR_DONE',
          'CLOSED'
        ),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      expertise_plan_date: { type: DataTypes.DATE, allowNull: true },
      expertise_effective_date: { type: DataTypes.DATE, allowNull: true },
      expertise_report_recieved: { type: DataTypes.DATE, allowNull: true },
      diagnostic: {
        type: DataTypes.ENUM('OK', 'REPAIRABLE', 'TOTAL_LOSS'),
        allowNull: true,
      },
      diagnostic_report_file: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },

      case1_date_of_service_plan: { type: DataTypes.DATE, allowNull: true },
      case1_pickup_plan_date: { type: DataTypes.DATE, allowNull: true },
      case1_pickup_effective_date: { type: DataTypes.DATE, allowNull: true },
      case1_date_of_service_effective: { type: DataTypes.DATE, allowNull: true },
      case1_end_date_of_service: { type: DataTypes.DATE, allowNull: true },
      case1_return_date_plan: { type: DataTypes.DATE, allowNull: true },
      case1_return_date_effective: { type: DataTypes.DATE, allowNull: true },
      case1_contractor_invoice_date: { type: DataTypes.DATE, allowNull: true },
      case1_contractor_invoice: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },
      case1_date_contractor_invoice_paid: { type: DataTypes.DATE, allowNull: true },
      case1_third_party_invoice_paid: { type: DataTypes.BOOLEAN, allowNull: true },

      case2_estimated_compensation: { type: DataTypes.FLOAT, allowNull: true },
      case2_approved_compensation: { type: DataTypes.BOOLEAN, allowNull: true },
      case2_pickup_plan_date: { type: DataTypes.DATE, allowNull: true },
      case2_insured_rib: {
        type: DataTypes.INTEGER,
        references: { model: 'document', key: 'id' },
        allowNull: true,
      },
      case2_pickup_effective_date: { type: DataTypes.DATE, allowNull: true },
      case2_compensation_payment_date: { type: DataTypes.DATE, allowNull: true },
      case2_third_party_invoice_paid: { type: DataTypes.BOOLEAN, allowNull: true },

      closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Request',
      tableName: 'request',
      timestamps: false,
    }
  );

  return Request;
};
