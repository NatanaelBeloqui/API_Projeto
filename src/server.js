const path = require('path');
const express = require('express');
const app = express();
const sequelize = require('./config/database');

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

async function startServer () {
    try {
        await sequelize.sync();
        console.log('O tempo é síncrono, mas nosso amor é eterno.');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
          });
    } catch (erro) {
        console.error('Erro! Me apaixonei...', erro);
    }
}

startServer();
