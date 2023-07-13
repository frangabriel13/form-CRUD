const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING
    }
  }, { timestamps: false })
}