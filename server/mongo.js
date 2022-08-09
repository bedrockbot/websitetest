const mongoose = require("mongoose")
const mongoPath = "mongodb+srv://Admin:BEdrockAdmin@cluster0.3rfci.mongodb.net/discordbot?retryWrites=true&w=majority"



module.exports = async () => {
    await mongoose.connect(
        mongoPath,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
    return mongoose

}
