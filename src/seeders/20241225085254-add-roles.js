'use strict';
const { Enums } = require('../utils/common')
const { ADMIN, EDITOR, VIEWER } = Enums.ROLE_NAME

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        role_id: 'role_ad7y1ss0jmin',
        name: 'ADMIN',
        key: ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 'role_edibhjqo3gdr',
        name: 'EDITOR',
        key: EDITOR,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 'role_vieuggygveer',
        name: 'VIEWER',
        key: VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
      key: [ADMIN, EDITOR, VIEWER],
    });
  },
};
