//creamos connexion con monggose
const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN, 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        console.log("DB online");
    } catch (error) {
        console.log(error);
        throw new('Error connexion base de datos')
    }
    
}

module.exports = {
    dbConnection
}


//mongodb+srv://mean_user:J7cmBX25@cluster0.ewhmw.mongodb.net/hospitaldb?authSource=admin&replicaSet=atlas-qvzamx-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true