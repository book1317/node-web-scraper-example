import fs from 'fs'

export function isDirectoryExist(directory: string) {
    return fs.existsSync(directory);
}

export async function createDirectory(directory: string) {
    return new Promise((resolve, reject) => {
        fs.mkdir(directory, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('New directory successfully created.');
                resolve('');
            }
        });
    })
}

export async function checkAndCreateDirectory(directory: string) {
    if (!isDirectoryExist(directory)) {
        await createDirectory(directory);
    }
}

export function listFiles(directoryPath: string) {
    try {
        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

        const files = entries
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name)

        return files;
    } catch (error: any) {
        console.error('Error:', error.message);
        return [];
    }
}

export function listFilesDirectory(directoryPath: string) {
    try {
        return sortFileNamesByNumber(listFiles(directoryPath)).map((file) => `${directoryPath}/${file}`);
    } catch (error: any) {
        console.error('Error:', error.message);
        return [];
    }
}

export function sortFileNamesByNumber(fileNames) {
    return fileNames.sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);

        if (numA < numB) {
            return -1;
        }
        if (numA > numB) {
            return 1;
        }
        return 0;
    });
}

export function listFolders(directoryPath) {
    try {
        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

        const folders = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);

        return folders;
    } catch (error: any) {
        console.error('Error:', error.message);
        return [];
    }
}