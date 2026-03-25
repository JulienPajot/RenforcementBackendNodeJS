'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: { type: Sequelize.STRING, allowNull: false },
      firstname: { type: Sequelize.STRING, allowNull: true },
      lastname: { type: Sequelize.STRING, allowNull: true },
      role: {
        type: Sequelize.ENUM('ADMIN', 'AGENT', 'EXPERT', 'CLIENT'),
        allowNull: false,
        defaultValue: 'CLIENT',
      },
      token: { type: Sequelize.TEXT, allowNull: true },
      refresh_token: { type: Sequelize.TEXT, allowNull: true },
      two_step_code: { type: Sequelize.STRING, allowNull: true },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_role";');
  },
};
