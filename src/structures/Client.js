const { Client, Collection, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus } = require('discord.js');
const BotUtils = require('./Utils');
const path = require('path'); // Asegúrate de importar path aquí

module.exports = class extends Client {
    constructor(options = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution
        ],
        partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
        allowedMentions: {
            parse: ["roles", "users"],
            repliedUser: false,
        },
        presence: {
            activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}],
            status: PresenceUpdateStatus.Online
        },
    }) {
        super(options);

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.slashArray = [];

        this.utils = new BotUtils(this);

        this.start();
    }

    async start() {
        console.log("🛫 Bot iniciando...");
    
        await this.loadCommands(); // Carga los comandos
        await this.loadHandlers(); // Carga los handlers
        await this.loadEvents(); // Carga los eventos
        await this.loadSlashCommands(); // Carga los comandos de barra
    
        console.log("Intentando iniciar sesión con el token");
    
        try {
            await this.login(process.env.BOT_TOKEN); // Inicia sesión con el token
            console.log(`Token check 🥇`); // Log de éxito al iniciar sesión
        } catch (error) {
            console.error(`Error al intentar iniciar sesión: ${error.message}`);
        }
    }
    

    async loadCommands() {
        console.log(`(${process.env.PREFIX}) Cargando comandos`.yellow);
        this.commands.clear();
        this.slashArray = [];

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/comandos");
        console.log(`Archivos encontrados: ${RUTA_ARCHIVOS}`);

        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                console.log(`Cargando archivo: ${rutaArchivo}`);
                const COMANDO = require(rutaArchivo);
                const NOMBRE_COMANDO = rutaArchivo.split(path.sep).pop().split(".")[0]; // Uso de path.sep para compatibilidad multiplataforma
                COMANDO.NAME = NOMBRE_COMANDO;

                if (NOMBRE_COMANDO) this.commands.set(NOMBRE_COMANDO, COMANDO); // Guarda el comando en la colección
            } catch (e) {
                console.error(`ERROR AL CARGAR EL COMANDO ${rutaArchivo}`.bgRed);
                console.error(e);
                console.error(`Error stack: ${e.stack}`);
            }
        });

        console.log(`(${process.env.PREFIX}) ${this.commands.size} Comandos cargados`.green);
    }

    async loadSlashCommands() {
        console.log(`(/) Cargando comandos`.yellow);
        this.slashCommands.clear();
        this.slashArray = [];

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/slashCommands");
        console.log(`Archivos encontrados: ${RUTA_ARCHIVOS}`);

        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                console.log(`Cargando archivo: ${rutaArchivo}`);
                const COMANDO = require(rutaArchivo);
                const NOMBRE_COMANDO = rutaArchivo.split(path.sep).pop().split(".")[0];
                COMANDO.CMD.name = NOMBRE_COMANDO;

                if (NOMBRE_COMANDO) this.slashCommands.set(NOMBRE_COMANDO, COMANDO); // Guarda el comando en la colección
                this.slashArray.push(COMANDO.CMD.toJSON()); // Añade el comando a la lista de comandos de barra
            } catch (e) {
                console.error(`ERROR AL CARGAR EL archivo ${rutaArchivo}`.bgRed);
                console.error(e);
                console.error(`Error stack: ${e.stack}`);
            }
        });

        console.log(`(/) ${this.slashCommands.size} Comandos cargados`.green);

        if (this.application?.commands) {
            this.application.commands.set(this.slashArray); // Publica los comandos de barra
            console.log(`(/) ${this.slashCommands.size} Comandos Publicados!`.green);
        }
    }

    async loadHandlers() {
        console.log(`(-) Cargando handlers`.yellow);

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/handlers");
        console.log(`Archivos encontrados: ${RUTA_ARCHIVOS}`);

        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                console.log(`Cargando handler: ${rutaArchivo}`);
                require(rutaArchivo)(this); // Carga y ejecuta cada handler
            } catch (e) {
                console.error(`ERROR AL CARGAR EL HANDLER ${rutaArchivo}`.bgRed);
                console.error(e);
                console.error(`Error stack: ${e.stack}`);
            }
        });

        console.log(`(-) ${RUTA_ARCHIVOS.length} Handlers cargados`.green);
    }
    
    async loadEvents() {
        console.log(`(+) Cargando eventos`.yellow);
        this.removeAllListeners();
    
        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/eventos");
        console.log(`Archivos encontrados: ${RUTA_ARCHIVOS}`);
    
        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                console.log(`Cargando evento: ${rutaArchivo}`);
                const EVENTO = require(rutaArchivo);
                const NOMBRE_EVENTO = rutaArchivo.split(path.sep).pop().split(".")[0];
                this.on(NOMBRE_EVENTO, EVENTO.bind(null, this));
            } catch (e) {
                console.error(`ERROR AL CARGAR EL EVENTO ${rutaArchivo}`.bgRed);
                console.error(e);
                console.error(`Error stack: ${e.stack}`);
            }
        });
    
        console.log(`(+) ${RUTA_ARCHIVOS.length} Eventos cargados`.green);
    }
    
}
