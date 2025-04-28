const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const saltRounds = 10
const secret = process.env.JWT_SECRET

module.exports = {
  async createUser(req, res) {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos (nome, email, senha) são obrigatórios.' })
    }
    try {
      const senhaHash = await bcrypt.hash(senha, saltRounds)
      const user = await Usuario.create({ nome, email, senha: senhaHash })
      const { id_usuario, nome: nomeUsuario, email: userEmail } = user
      res.status(201).json({ message: 'Usuário criado com sucesso!', user: { id_usuario, nome: nomeUsuario, email: userEmail } })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar usuário.', details: err.message })
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await Usuario.findAll({ attributes: ['id_usuario', 'nome', 'email'] })
      res.json(users)
    } catch {
      res.status(500).json({ error: 'Erro ao listar usuários.' })
    }
  },

  async updateUser(req, res) {
    const { id } = req.params
    const { nome } = req.body
    if (!nome) {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' })
    }
    try {
      const user = await Usuario.findByPk(id)
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }
      user.nome = nome
      await user.save()
      const { id_usuario, nome: nomeUsuario, email } = user
      res.json({ message: 'Usuário atualizado com sucesso!', user: { id_usuario, nome: nomeUsuario, email } })
    } catch {
      res.status(500).json({ error: 'Erro ao atualizar usuário.' })
    }
  },

  async deleteUser(req, res) {
    const { id } = req.params
    try {
      const deleted = await Usuario.destroy({ where: { id_usuario: id } })
      if (!deleted) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }
      res.status(204).send()
    } catch {
      res.status(500).json({ error: 'Erro ao remover usuário.' })
    }
  },

  async login(req, res) {
    const { email, senha } = req.body
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }
    try {
      const user = await Usuario.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' })
      }
      const senhaValida = await bcrypt.compare(senha, user.senha)
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas.' })
      }
      const payload = { id_usuario: user.id_usuario, email: user.email }
      const token = jwt.sign(payload, secret)
      res.json({ message: 'Login realizado com sucesso!', token })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao fazer login.', details: err.message })
    }
  }
}
