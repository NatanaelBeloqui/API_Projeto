const Projeto = require('../models/projeto')
const Usuario = require('../models/usuario')

module.exports = {
  async createProject(req, res) {
    const { titulo, descricao, id_usuario } = req.body
    if (!titulo || !id_usuario) {
      return res.status(400).json({ error: 'Os campos titulo e id_usuario são obrigatórios.' })
    }
    if (req.user.id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'Acesso negado: usuário inválido.' })
    }
    try {
      const projetoExistente = await Projeto.findOne({ where: { titulo, id_usuario } })
      if (projetoExistente) {
        return res.status(400).json({ error: 'Já existe um projeto com esse título.' })
      }
      const projeto = await Projeto.create({ titulo, descricao, id_usuario })
      res.status(201).json({ message: 'Projeto criado com sucesso!', projeto })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao criar projeto.', details: err.message })
    }
  },

  async getAllProjects(req, res) {
    try {
      const projetos = await Projeto.findAll({
        where: { id_usuario: req.user.id_usuario },
        include: [{ model: Usuario, as: 'usuario' }],
        attributes: ['id_projeto', 'titulo', 'descricao', 'id_usuario']
      })
      res.json(projetos)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao listar projetos.', details: err.message })
    }
  },

  async updateProject(req, res) {
    const { id } = req.params
    const { titulo, descricao } = req.body
    if (!titulo) {
      return res.status(400).json({ error: 'O campo titulo é obrigatório.' })
    }
    try {
      const projeto = await Projeto.findByPk(id)
      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado.' })
      }
      if (projeto.id_usuario !== req.user.id_usuario) {
        return res.status(403).json({ error: 'Acesso negado: não dono do projeto.' })
      }
      projeto.titulo = titulo
      projeto.descricao = descricao
      await projeto.save()
      res.json({ message: 'Projeto atualizado com sucesso!', projeto })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao atualizar projeto.', details: err.message })
    }
  },

  async deleteProject(req, res) {
    const { id } = req.params
    try {
      const projeto = await Projeto.findByPk(id)
      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado.' })
      }
      if (projeto.id_usuario !== req.user.id_usuario) {
        return res.status(403).json({ error: 'Acesso negado: não dono do projeto.' })
      }
      await Projeto.destroy({ where: { id_projeto: id } })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao remover projeto.', details: err.message })
    }
  }
}
