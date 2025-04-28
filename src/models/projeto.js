const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Usuario = require('./usuario')

const Projeto = sequelize.define('Projeto', {
  id_projeto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'projetos',
  timestamps: false
})

Projeto.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' })
Usuario.hasMany(Projeto, { foreignKey: 'id_usuario', as: 'usuario' })

module.exports = Projeto
