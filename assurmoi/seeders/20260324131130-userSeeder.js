'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: 'admin123',
        firstname: 'Admin',
        lastname: 'Root',
        email: 'admin@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jdupont',
        password: 'password123',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'mmartin',
        password: 'password123',
        firstname: 'Marie',
        lastname: 'Martin',
        email: 'marie.martin@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      username: ['admin', 'jdupont', 'mmartin']
    }, {});
  }
};
