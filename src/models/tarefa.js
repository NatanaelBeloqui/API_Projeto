const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Usuario = require('./usuario')
const Projeto = require('./projeto')

const Tarefa = sequelize.define('Tarefa', {
  id_tarefa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_projeto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Projeto,
      key: 'id_projeto'
    },
    onDelete: 'CASCADE'
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
  tableName: 'tarefas',
  timestamps: false
})

Tarefa.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuarios' })
Tarefa.belongsTo(Projeto, { foreignKey: 'id_projeto', as: 'projetos' })
Usuario.hasMany(Tarefa, { foreignKey: 'id_usuario', as: 'tarefas' })
Projeto.hasMany(Tarefa, { foreignKey: 'id_projeto', as: 'tarefas' })

module.exports = Tarefa
