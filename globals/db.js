import mongoose from 'mongoose'

function loadDb () {

    mongoose.connect('mongodb://localhost:27017/murple', { useNewUrlParser: true, useUnifiedTopology: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'Connection Error:'))
    db.once('open', () => console.log('Connected to MongoDB.'))

    const userSchema = new mongoose.Schema({
        uuid: String,
        name: String,
        nickname: String,
        icon: String,
        lastLogIn: { type: Date, default: Date.now },
        email: String,
        courses: Array
    })

    const User = mongoose.model('User', userSchema)

    return {
        schema: userSchema,
        User: User,
        connection: db

    }
}

export default loadDb