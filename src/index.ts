import main from "./main";
import SimpleStorage from "./storage/simple_storage";
import log from "loglevel";

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "prod"){
    log.setLevel("error");
} else if (process.env.NODE_ENV === "dev"){
    log.setLevel("debug");
    log.info("Running in dev mode");
} else if (process.env.NODE_ENV === "trace"){
    log.setLevel("trace");
    log.info("Running in trace mode");
} else {
    log.setLevel("error")
}

main(new SimpleStorage());