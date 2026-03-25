'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sinister', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      plate: { type: Sequelize.STRING, allowNull: true },
      driver_firstname: { type: Sequelize.STRING, allowNull: true },
      driver_lastname: { type: Sequelize.STRING, allowNull: true },
      driver_is_insured: { type: Sequelize.BOOLEAN, allowNull: true },
      call_datetime: { type: Sequelize.DATE, allowNull: true },
      sinister_datetime: { type: Sequelize.DATE, allowNull: true },
      context: { type: Sequelize.TEXT, allowNull: true },
      driver_responsability: { type: Sequelize.BOOLEAN, allowNull: true },
      driver_engaged_responsability: { type: Sequelize.INTEGER, allowNull: true },
      cni_driver: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'document', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      vehicule_registration_certificate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'document', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      insurance_certificate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'document', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      validated: { type: Sequelize.BOOLEAN, defaultValue: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sinister');
  },
};
