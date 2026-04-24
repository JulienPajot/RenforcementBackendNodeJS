'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sinister', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'user', key: 'id' },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('sinister', 'user_id');
  },
};
