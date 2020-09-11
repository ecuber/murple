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

  /**
   * Returns an object by its _id. Defaults to user collection.
   * @param {string} id - _id of desired object
   * @param {string} model - Desired collection (e.g. account, user, session)
   * @param {string} options - Search options
   */
  async function findObject (id, model = 'user', options = '') {
    const document = await models[model].findById(id, options)
    return document
  }

  /**
   * Returns object associated with a given user id. Defaults to account collection.
   * @param {string} id - User ID
   * @param {string} model - Desired collection (e.g. account, user, session)
   * @param {string} options - Search options
   */
  async function findObjectByUserId (id, model = 'account', options = '') {
    const document = await models[model].findOne({ userId: id }, options)
    return document
  }

  /**
   * Sets the value of a given property to a new value. Defaults to User collection.
   * @param {string} id - Object ID
   * @param {string} key - Propery name
   * @param {Object} value - New value
   * @param {string} model - Desired collection (e.g. account, user, session)
   */
  async function updateProperty (id, key, value, model = 'user') {
    const doc = await findObject(id, model)
    if (doc) {
      if (!doc[key]) {
        doc[key] = null
      }
      doc[key] = value
      doc.markModified(key)
      return await doc.save()
    }
    console.error('bruh couldnt find that object')
  }

  /**
   * For updating individual courses in the course array.
   * @param {string} id - Object ID
   * @param {string} key - Object property to search
   * @param {Object} value - New values to update the array element
   * @param {string} courseId - ID of target course object
   * @param {string} subKey - Property where the array itself is
   * @param {string} model - Desired collection (e.g. account, user, session)
   */
  async function updateCourse (id, key, value, courseId, subKey = 'courses', model = 'user') {
    const doc = await findObject(id, model)
    if (doc) {
      const target = doc[key][subKey].indexOf(doc[key][subKey].find(elem => elem.id === courseId))
      const course = doc[key][subKey][target]
      Object.keys(value).forEach(prop => {
        course[prop] = value[prop]
      })
      doc.markModified(key)
      return await doc.save()
    }
  }

  /**
   * Moves a course from its current position in the array to a new position.
   * @param {string} id - Object ID
   * @param {*} old - Current index of course in array
   * @param {*} final Desired final index of course in the array
   */
  async function reorderCourse (id, old, final) {
    const doc = await findObject(id, 'user')
    const courses = doc.data.courses
    const target = courses.splice(old, 1)
    courses.splice(final, 0, target[0])
    doc.markModified('data')
    return await doc.save()
  }

  /**
   * Sets the value of an array with a given uuid, model, key, and new array contents. Only adds items
   * with unique ID properties (not already found in array) to the existing array.
   * @param {*} id - Object ID
   * @param {*} model - Desired collection (e.g. account, user, session)
   * @param {*} key - Object property name
   * @param {*} array - Array to set property value to
   */
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
      return await doc.save()
    }
    console.error('bruh couldnt find that object')
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
    connection: db,
    idFromSession,
    idFromProviderId,
    findObject,
    findObjectByUserId,
    updateArray,
    close,
    update: updateProperty,
    updateCourse,
    reorderCourse
  }
}

export default Database
