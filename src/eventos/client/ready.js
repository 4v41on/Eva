const mongoose = require('mongoose')

module.exports = client => {

    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log('☁ estamos en la base de datos ');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
     
    }

       console.log(`Conectado como ${client.user.tag}`.green)

    if(client.application?.commands) {
        client.application.commands.set(client.slashArray);
        console.log(`(/) ${client.slashCommands.size} Comandos Publicados!`.green);
    }

   
};
