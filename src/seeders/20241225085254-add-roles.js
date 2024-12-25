'use strict';
const { Enums } = require('../utils/common')
const { ADMIN, EDITOR, VIEWER } = Enums.ROLE_NAME

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        role_id: 'role_dd7dagcdtrww',
        name: 'ADMIN',
        key: ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 'role_agcdfncceyww',
        name: 'EDITOR',
        key: EDITOR,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 'role_wuggygbgvew',
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
