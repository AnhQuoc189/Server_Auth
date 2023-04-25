const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect('mongodb+srv://quocanh:quocanh-1809@cluster0.jo6e3wp.mongodb.net/APP_AUTH', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            'Database connected: ',
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;
