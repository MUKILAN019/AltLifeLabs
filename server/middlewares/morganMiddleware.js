import morgan from "morgan";
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

const logDir = path.join(__dir,'../logs');

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(path.join(logDir,"access.txt"),{flag:"a"});

const morganFor = "[:date[iso]][:method][:url]";

const morganMiddleware = morgan(morganFor,{
    stream:accessLogStream,
})

export default morganMiddleware;