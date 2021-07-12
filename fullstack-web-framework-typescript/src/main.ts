import * as http from "http";
import * as path from "path";
import * as fs from "fs";

import { check, value_or_default } from "./util";

class StaticFile {
    path: string;
    content: string | Buffer;
    mime: string;
    constructor(path: string, content: string | Buffer, mime: string) {
        this.path = path; this.content = content; this.mime = mime;
    }
}

const static_files: Array<StaticFile> = [];

const application_path = value_or_default(process.argv[2], process.cwd());

check(fs.existsSync(application_path), `${application_path} does not exist`)

const image_path = path.join(application_path, "images")
const image_built_path = path.join(application_path, ".build_cache", "images")

if (fs.existsSync(image_path)) {
    fs.readdirSync(image_path).forEach(file => {
        if ([".jpg", ".jpeg"].includes(path.extname(file))) {
            const image_path_full = path.join(image_path, file);
            const image_built_path_full = path.join(image_built_path, file);
            const image_contents = fs.readFileSync(image_path_full);
            if (!fs.existsSync(image_built_path_full)) {
                
            } else {
                console.log("Does exist")
                const image_built_contents = fs.readFileSync(image_built_path_full);
                if (!image_contents.equals(image_built_contents)) {
                    console.log("Not equal")
                    fs.createReadStream(image_path_full)
                        .pipe(fs.createWriteStream(image_built_path_full));
                }
            }
            static_files.push(new StaticFile(path.basename(file), image_contents, "image/jpeg"));
        } else if ([".png"].includes(path.extname(file))) {
            const contents = fs.readFileSync(path.join(image_path, file));
            static_files.push(new StaticFile(path.basename(file), contents, "image/png"));
        }
    });
}

console.log(static_files);

http.createServer((req, res) => {
    const url_split = req.url!.split("/");
    if (url_split[1] === "img") {
        for (let static_file of static_files) {
            if (static_file.path == url_split[2]) {
                res.setHeader("content-type", static_file.mime);
                res.end(static_file.content);
            }
        }
    }
}).listen(8080);
