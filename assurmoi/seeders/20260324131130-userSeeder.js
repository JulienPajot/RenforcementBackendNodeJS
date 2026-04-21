'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123',parseInt(process.env.ENCRYPT_SALT))
    await queryInterface.bulkInsert('user', [
      {
        username: 'admin',
        password: hashedPassword,
        firstname: 'Admin',
        lastname: 'Root',
        email: 'admin@example.com',
      },
      {
        username: 'jdupont',
        password: hashedPassword,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@example.com',
      },
      {
        username: 'mmartin',
        password: hashedPassword,
        firstname: 'Marie',
        lastname: 'Martin',
        email: 'marie.martin@example.com',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      username: ['admin', 'jdupont', 'mmartin']
    }, {});
  }
};
