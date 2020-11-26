const mongoose = require('mongoose');

const dbConnection = async (  ) => {

    try {

        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log('DB ONLINE');

    } catch ( err ) {
        console.log( err );
        throw new Error( 'Failed to connect to database' );
    }

}

module.exports = {
    dbConnection
}