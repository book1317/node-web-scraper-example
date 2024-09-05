export function isIncludeString(originalString, exclusionArray) {
    return exclusionArray.some((exclusion) => originalString.includes(exclusion));
}

export function parseFilenames(fileName) {
    const match = fileName.match(/_(\d+)\.jpg/);
    if (match && match[1]) {
        const index = parseInt(match[1], 10) + 1;
        return `${index}.jpg`;
    }
    return fileName;
}