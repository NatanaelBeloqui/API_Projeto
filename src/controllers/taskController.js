const Tarefa = require('../models/tarefa')
const Projeto = require('../models/projeto')
const Usuario = require('../models/usuario')

module.exports = {
  async createTask(req, res) {
    const { titulo, status, id_projeto, id_usuario } = req.body
    if (!titulo || status === undefined || !id_projeto || !id_usuario) {
      return res.status(400).json({ error: 'Os campos titulo, status, id_projeto e id_usuario são obrigatórios.' })
    }
    if (req.user.id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'Acesso negado: usuário inválido.' })
    }
    try {
      const projeto = await Projeto.findByPk(id_projeto)
      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado.' })
      }
      const tarefa = await Tarefa.create({ titulo, status, id_projeto, id_usuario })
      res.status(201).json({ message: 'Tarefa criada com sucesso!', tarefa })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao criar tarefa.', details: err.message })
    }
  },

  async getAllTasks(req, res) {
    try {
      const tarefas = await Tarefa.findAll({
        where: { id_usuario: req.user.id_usuario },
        include: [
          { model: Projeto, as: 'projetos' },
          { model: Usuario, as: 'usuarios' }
        ],
        attributes: ['id_tarefa', 'titulo', 'status', 'id_projeto', 'id_usuario']
      })
      res.json(tarefas)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao listar tarefas.', details: err.message })
    }
  },

  async getTaskById(req, res) {
    const { id } = req.params
    try {
      const tarefa = await Tarefa.findByPk(id, {
        include: [
          { model: Projeto, as: 'projetos' },
          { model: Usuario, as: 'usuarios' }
        ],
        attributes: ['id_tarefa', 'titulo', 'status', 'id_projeto', 'id_usuario']
      })
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' })
      }
      if (tarefa.id_usuario !== req.user.id_usuario) {
        return res.status(403).json({ error: 'Acesso negado: não dono da tarefa.' })
      }
      res.json(tarefa)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao buscar tarefa.', details: err.message })
    }
  },

  async updateTask(req, res) {
    const { id } = req.params
    const { titulo, status, id_projeto, id_usuario } = req.body
    if (!titulo || status === undefined || !id_projeto || !id_usuario) {
      return res.status(400).json({ error: 'Os campos titulo, status, id_projeto e id_usuario são obrigatórios.' })
    }
    try {
      const tarefa = await Tarefa.findByPk(id)
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' })
      }
      if (tarefa.id_usuario !== req.user.id_usuario) {
        return res.status(403).json({ error: 'Acesso negado: não dono da tarefa.' })
      }
      tarefa.titulo = titulo
      tarefa.status = status
      tarefa.id_projeto = id_projeto
      await tarefa.save()
      res.json({ message: 'Tarefa atualizada com sucesso!', tarefa })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao atualizar tarefa.', details: err.message })
    }
  },

  async deleteTask(req, res) {
    const { id } = req.params
    try {
      const tarefa = await Tarefa.findByPk(id)
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' })
      }
      if (tarefa.id_usuario !== req.user.id_usuario) {
        return res.status(403).json({ error: 'Acesso negado: não dono da tarefa.' })
      }
      await Tarefa.destroy({ where: { id_tarefa: id } })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao remover tarefa.', details: err.message })
    }
  }
}
