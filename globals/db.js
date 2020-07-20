import mongoose from 'mongoose'

const Database = () => {
  const accountSchema = new mongoose.Schema({
  }, { strict: false, minimize: false })

  const userSchema = new mongoose.Schema({
    nickname: String,
    data: {
      courses: Array
    }
  }, { strict: false, minimize: false })

  const sessionSchema = new mongoose.Schema({}, { strict: false, minimize: false })

  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'Connection Error:'))
  db.once('open', () => {})

  const Account = db.model('account', accountSchema, 'accounts')
  const User = db.model('user', userSchema, 'users')
  const Session = db.model('session', sessionSchema, 'sessions')

  const models = {
    account: Account,
    user: User,
    session: Session
  }

  async function findObject (id, model = 'user', options = '') {
    const document = await models[model].findById(id, options)
    return document
  }

  async function findObjectByUserId (id, model = 'account', options = '') {
    const document = await models[model].findOne({ userId: id }, options)
    return document
  }

  async function updateArray (id, model, key, array) {
    const doc = await findObject(id, model)
    if (doc) {
      if (!doc.data) {
        const obj = {}
        obj[key] = []
        doc.data = obj
      }
      if (!doc.data[key]) {
        doc.data[key] = []
      }
      if (Array.isArray(doc.data[key])) {
        for (let i = 0; i < array.length; i++) {
          if (!doc.data[key].filter(obj => obj.id === array[i].id).length > 0) {
            doc.data[key].push(array[i])
          }
        }
      }
      doc.markModified('data')
      console.log(doc.data)
      return await doc.save()
    }
    console.error('bruh couldnt find it')
  }

  /**
   * Returns a document containing the user object _id from users collection
   * @param {Object} session session object from nextauth
   */
  function idFromSession (session) {
    const accessToken = session.accessToken
    const document = Session.findOne({ accessToken: accessToken }, 'userId', (err, doc) => {
      if (err) return console.error(err)
      return Promise.resolve(doc ? doc.toObject() : null)
    })
    return document.exec()
  }

  /**
   * Returns a document containing the user object _id from users collection
   * @param {String} provicerId google user id
   */
  async function idFromProviderId (providerId) {
    const document = Account.findOne({ providerAccountId: providerId }, 'userId', (err, doc) => {
      if (err) return console.error(err)
      return Promise.resolve(doc ? doc.toObject() : null)
    })
    return document.exec()
  }

  /**
   * Close connection
   * @param {Promise<mongoose.Connection>} client Mongoose Client
   */
  function close () {
    return db.close()
  }

  return {
    idFromSession: idFromSession,
    idFromProviderId: idFromProviderId,
    findObject: findObject,
    findObjectByUserId: findObjectByUserId,
    updateArray: updateArray,
    close: close
  }
}

export default Database
