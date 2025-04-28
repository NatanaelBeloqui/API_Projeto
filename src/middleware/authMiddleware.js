const jwt = require('jsonwebtoken');  
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];                        
  const token = authHeader && authHeader.split(' ')[1];                     

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });         
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {            
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });           
    }
    req.user = decoded;                                                  
    next();
  });
}

module.exports = authenticateToken;
