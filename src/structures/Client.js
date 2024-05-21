
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus } = require('discord.js');
const BotUtils = require('./utils');

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

        await this.loadCommands();
        await this.loadHandlers();
        await this.loadEvents();
        await this.loadSlashCommands();

        console.log("Intentando iniciar sesión con el token");

        this.login(process.env.BOT_TOKEN);

        console.log(`Token check 🥇  `);
    }

    async loadCommands() {
        console.log(`(${process.env.PREFIX}) Cargando comandos`.yellow);
        this.commands.clear();
        this.slashArray = [];

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/comandos");
        console.log(`Archivos encontrados: ${RUTA_ARCHIVOS}`); // Añadir un log para verificar

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    console.log(`Cargando archivo: ${rutaArchivo}`);
                    const COMANDO = require(rutaArchivo);
                    const NOMBRE_COMANDO = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];

                    COMANDO.NAME = NOMBRE_COMANDO;

                    if (NOMBRE_COMANDO) this.commands.set(NOMBRE_COMANDO, COMANDO);
                } catch (e) {
                    console.error(`ERROR AL CARGAR EL COMANDO ${rutaArchivo}`.bgRed);
                    console.error(e);
                    console.error(`Error stack: ${e.stack}`); // Añadir la pila de errores para más detalles
                }
            });
        }

        console.log(`(${process.env.PREFIX}) ${this.commands.size} Comandos cargados`.green);
    }

    async loadSlashCommands() {
        console.log(`(/) Cargando comandos`.yellow);
        this.slashCommands.clear();
        this.slashArray = [];

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/slashComands");

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    console.log(`Cargando archivo: ${rutaArchivo}`);
                    const COMANDO = require(rutaArchivo);
                    const NOMBRE_COMANDO = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    COMANDO.CMD.name = NOMBRE_COMANDO;

                    if (NOMBRE_COMANDO) this.slashCommands.set(NOMBRE_COMANDO, COMANDO);

                    this.slashArray.push(COMANDO.CMD.toJSON());
                } catch (e) {
                    console.error(`ERROR AL CARGAR EL archivo ${rutaArchivo}`.bgRed);
                    console.error(e);
                    console.error(`Error stack: ${e.stack}`); // Añadir la pila de errores para más detalles
                }
            });
        }

        console.log(`(/) ${this.slashCommands.size} Comandos cargados`.green);

        if (this?.application?.commands) {
            this.application.commands.set(this.slashArray);
            console.log(`(/) ${this.slashCommands.size} Comandos Publicados!`.green);
        }
    }

    async loadHandlers() {
        console.log(`(-) Cargando handlers`.yellow);

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/handlers");

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    console.log(`Cargando handler: ${rutaArchivo}`);
                    require(rutaArchivo)(this);
                } catch (e) {
                    console.error(`ERROR AL CARGAR EL HANDLER ${rutaArchivo}`.bgRed);
                    console.error(e);
                    console.error(`Error stack: ${e.stack}`); // Añadir la pila de errores para más detalles
                }
            });
        }

        console.log(`(-) ${RUTA_ARCHIVOS.length} Handlers cargados`.green);
    }

    async loadEvents() {
        console.log(`(+) Cargando eventos`.yellow);
        this.removeAllListeners();

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/eventos");

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    console.log(`Cargando evento: ${rutaArchivo}`);
                    const EVENTO = require(rutaArchivo);
                    const NOMBRE_EVENTO = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    this.on(NOMBRE_EVENTO, EVENTO.bind(null, this));
                } catch (e) {
                    console.error(`ERROR AL CARGAR EL EVENTO ${rutaArchivo}`.bgRed);
                    console.error(e);
                    console.error(`Error stack: ${e.stack}`); // Añadir la pila de errores para más detalles
                }
            });
        }

        console.log(`(+) ${RUTA_ARCHIVOS.length} Eventos cargados`.green);
    }
}
