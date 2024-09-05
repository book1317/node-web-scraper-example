import axios from "axios";
import fs from 'fs';

export function downloadImage(url: string, destination: string) {
    return new Promise((resolve, reject) => {
        axios({
            url,
            responseType: 'stream',
        })
            .then((response) => {
                const writeStream = fs.createWriteStream(destination);

                writeStream.on('finish', () => {
                    console.log(`Image downloaded successfully to ${destination}`);
                    resolve('');
                });

                writeStream.on('error', (error) => {
                    console.error('Error:', error.message);
                    console.log('URL:', url);
                    console.log('DESTINATION:', destination);
                    reject(error);
                });

                response.data.pipe(writeStream);
            })
            .catch((error) => {
                console.error('Error:', error.message);
                console.log('URL:', url);
                console.log('DESTINATION:', destination);
                reject(error);
            });
    });
}