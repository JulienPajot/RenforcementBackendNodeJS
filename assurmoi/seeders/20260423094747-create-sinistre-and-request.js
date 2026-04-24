'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Sinistres
    await queryInterface.bulkInsert('sinister', [
      {
        plate: 'AB-123-CD',
        driver_firstname: 'Jean',
        driver_lastname: 'Dupont',
        driver_is_insured: true,
        call_datetime: new Date('2024-03-14T09:00:00Z'),
        sinister_datetime: new Date('2024-03-15T10:30:00Z'),
        context: 'Collision sur autoroute A6',
        driver_responsability: true,
        driver_engaged_responsability: 100,
        validated: true,
        user_id: 1,
      },
      {
        plate: 'EF-456-GH',
        driver_firstname: 'Marie',
        driver_lastname: 'Martin',
        driver_is_insured: true,
        call_datetime: new Date('2024-02-27T08:00:00Z'),
        sinister_datetime: new Date('2024-02-28T14:00:00Z'),
        context: 'Accrochage en parking',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: true,
        user_id: 1,
      },
      {
        plate: 'IJ-789-KL',
        driver_firstname: 'Paul',
        driver_lastname: 'Bernard',
        driver_is_insured: false,
        call_datetime: new Date('2024-01-09T11:00:00Z'),
        sinister_datetime: new Date('2024-01-10T09:00:00Z'),
        context: 'Sortie de route par verglas',
        driver_responsability: true,
        driver_engaged_responsability: 50,
        validated: false,
        user_id: 1,
      },
    ]);

    // Récupère les IDs insérés pour lier les requests
    const sinisters = await queryInterface.sequelize.query(
      `SELECT id FROM sinister WHERE user_id = 1 ORDER BY id ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [s1, s2, s3] = sinisters;

    await queryInterface.bulkInsert('request', [
      { sinister_id: s1.id, status: 'IN_PROGRESS' },
      { sinister_id: s1.id, status: 'EXPERTISE_PLANNED' },
      { sinister_id: s2.id, status: 'REPAIR_DONE' },
      { sinister_id: s2.id, status: 'CLOSED' },
      { sinister_id: s3.id, status: 'PENDING' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('request', {
      sinister_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          `(SELECT id FROM sinister WHERE user_id = 1)`
        ),
      },
    });

    await queryInterface.bulkDelete('sinister', { user_id: 1 });
  },
};