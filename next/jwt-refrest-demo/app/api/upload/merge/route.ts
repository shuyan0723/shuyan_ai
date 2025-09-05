import {
    NextResponse,
    NextRequest
} from "next/server";
import {
    ensureUploadDirs,
    listUploadedChunks,
    readMeta,
    writeMeta,
    fileAlreadyExist,
    mergeChunks,
} from "@/lib/upload-server";

export async function POST(req:NextRequest){
    const {
        fileHash,
        fileName,
        fileSize,
        chunkSize,
        totalChunks
    }=await req.json();
    ensureUploadDirs(fileHash);

    if(fileAlreadyExist(fileHash,fileName)){
        return NextResponse.json({
            complete:true,
            uploaded:[],
            message:"秒传：文件已存在"
        })
    }
    const existed=readMeta(fileHash,fileName);
    if(existed){
        return NextResponse.json({
            complete:true,
            uploaded:existed,
            message:"秒传：文件已存在"
        })
    }
}