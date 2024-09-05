import fs from 'fs';
import pdfkit from 'pdfkit';

export async function createPDF(imageDirectoryList, fileName, directory) {
    return new Promise((resolve, reject) => {
        try {

            let doc = new pdfkit({ autoFirstPage: false })
            doc.pipe(fs.createWriteStream(`${directory}/${fileName}.pdf`))

            for (let i = 0; i < imageDirectoryList.length; i++) {
                let img = doc.openImage(imageDirectoryList[i]);
                doc.addPage({ size: [img.width, img.height] });
                doc.image(img, 0, 0);
            }

            doc.end()
            console.log('Create PDF success')
            resolve('');
        } catch (err) {
            console.log('Error on create PDF')
            reject(err)
        }

    })

}