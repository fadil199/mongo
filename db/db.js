const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://achmadfadilla112:19maret1995@cluster0.oeayxrk.mongodb.net/test",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('Database Connected'));