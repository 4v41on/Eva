module.exports = client => {
    console.log(`sesion iniciada como ${client.suer.tag}`)
    if(client?.application?.commands){
        client.application.commands.set(client.slashArray)
        console.log(`(/) ${client.slashCommands.size}Comandos Publicadoss! `.green)
    }
}