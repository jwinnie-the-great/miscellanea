
import * as path from "path";

export function check(condition: boolean, error: string): void | never {
    if (!condition) {
        console.error(`error: ${error}`)
        process.exit(1);
    } else {
        return;
    }
}

export function value_or_default<T>(value: T, default_value: T): T {
    if (value !== null && value !== undefined) {
        return value;
    } else {
        return default_value;
    }
}

export function file_get_mime(filename: string): string {
    if ([".jpeg", ".jpg"].includes(path.extname(filename))) {
        return "text/jpeg";
    }
    else if (path.extname(filename) == ".png") {
        
    }
}