'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      org_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Organizations', // Corrected to "model"
          key: 'org_id', // Corrected to "key"
        },
        onDelete: 'CASCADE',
      },
      role_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Roles', // Corrected to "model"
          key: 'role_id', // Corrected to "key"
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users'); // Corrected typo
  },
};
