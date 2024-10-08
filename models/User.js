const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (username, password, role = 'User') => {
  const validRoles = ['User', 'Admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role value');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { 
      throw new Error('Username already exists');
    }
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

module.exports = { createUser, findUserByUsername };
