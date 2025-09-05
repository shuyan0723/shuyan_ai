const target=finalFilePath(fileHash,fileName);
const ws=createWriteStream(target);
for(let i=0;i<totalChunks;i++){
    const p=join(chunkDir,`${i}.part`);
    if(!existsSync(p)) throw new Error(`缺少分片:${i}`);
    const data=readFileSync(p);
    ws.write(data);
}
