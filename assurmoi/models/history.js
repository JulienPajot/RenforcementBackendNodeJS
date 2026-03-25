const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  History.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'History',
      tableName: 'history',
      timestamps: false,
    }
  );

  return History;
};
