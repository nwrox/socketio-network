import Knex from 'knex'
import { minDate } from '../utils'

const knex = () => {
  const {
    SESSION_DB_HOST,
    SESSION_DB_NAME,
    SESSION_DB_PASSWORD,
    SESSION_DB_PORT,
    SESSION_DB_PROVIDER,
    SESSION_DB_USER
  } = process.env

  return Knex({
    client: SESSION_DB_PROVIDER,
    connection: {
      host: SESSION_DB_HOST,
      port: SESSION_DB_PORT,
      database: SESSION_DB_NAME,
      user: SESSION_DB_USER,
      password: SESSION_DB_PASSWORD,
      charset: 'utf8'
    }
  })
}

export const getAll = (currPage = 1, perPage = 10) => {
  const db = knex()
  const { SESSION_DB_TABLE } = process.env

  if (currPage < 1) {
    currPage = 1
  }

  const skip = (currPage - 1) * perPage

  return Promise.all([
    db.from(SESSION_DB_TABLE)
      .count('* as count'),
    db.from(SESSION_DB_TABLE)
      .select('*')
      .offset(skip)
      .limit(perPage)
  ]).then(([total, rows]) => {
    console.log(total, rows)
  }).catch(err => {
    throw err
  })
  .finally(() => {
    db.destroy()
  })
}

export const getLastBy = (login, ip) => {
  const db = knex()
  const { SESSION_DB_TABLE } = process.env

  // c# --> 0 == false && 1 == true
  return db.from(SESSION_DB_TABLE)
  .select('*')
  .where({
    login,
    ip,
    eh_sessao_web: 0
  })
  .whereNull('dt_logout')
  .orWhere({
    dt_logout: minDate()
  })
  .whereNull('dt_desativacao')
  .orWhere({
    dt_desativacao: minDate()
  })
  .orderBy('dt_login', 'desc')
  .first()
  .then(row => row)
  .catch(err => {
    throw err
  })
  .finally(() => {
    db.destroy()
  })
}

export const save = session => {
  const db = knex()
  const { SESSION_DB_TABLE } = process.env

  db.insert(session)
    .into(SESSION_DB_TABLE)
    .catch(err => {
      throw errr
    })
    .finally(() => {
      db.destroy()
    })
}
