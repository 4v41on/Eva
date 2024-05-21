module.exports = client => {
    console.log(`sesion iniciada como ${client.user.tag}`.green)
    if(client?.application?.commands){
        client.application.commands.set(client.slashArray)
        console.log(`(/) ${client.slashCommands.size}Comandos Publicadoss! `.green)
    }
}