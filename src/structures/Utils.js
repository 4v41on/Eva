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
            const files = await fs.promises.readdir(dirPath);
            const filteredFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.json'));
            console.log(`Archivos encontrados en ${dirName}: ${filteredFiles}`);
            
            filteredFiles.forEach((file) => {
                const filePath = path.join(dirPath, file);
                console.log(`Eliminando caché para: ${filePath}`);
                delete require.cache[require.resolve(filePath)];
            });
            
            return filteredFiles.map(file => path.join(dirPath, file));
        } catch (error) {
            console.error(`Error cargando archivos de ${dirName}: ${error.message}`);
            return [];
        }
    }
}
