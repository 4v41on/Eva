const fs = require('fs');
const path = require('path');

module.exports = class BotUtils {
    constructor(client) {
        this.client = client;
    }

    async loadFiles(dirName) {
        const dirPath = path.join(process.cwd(), dirName);
        console.log(`📦 Cargando archivos de: ${dirName}`);
        console.log(`Directorio completo: ${dirPath}`);

        try {
            const files = await this.getAllFiles(dirPath);
            const filteredFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.json'));
            console.log(`Archivos encontrados en ${dirName}: ${filteredFiles}`);
            
            filteredFiles.forEach((file) => {
                console.log(`Eliminando caché para: ${file}`);
                delete require.cache[require.resolve(file)];
            });
            
            return filteredFiles;
        } catch (error) {
            console.error(`Error cargando archivos de ${dirName}: ${error.message}`);
            return [];
        }
    }

    async getAllFiles(dir) {
        const subdirs = await fs.promises.readdir(dir);
        const files = await Promise.all(subdirs.map(async (subdir) => {
            const res = path.resolve(dir, subdir);
            return (await fs.promises.stat(res)).isDirectory() ? this.getAllFiles(res) : res;
        }));
        return files.reduce((a, f) => a.concat(f), []);
    }
}
