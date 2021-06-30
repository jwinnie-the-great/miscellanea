
extern crate dialoguer;
extern crate clap;
extern crate tar;
extern crate directories;

use logger;
use panic_hook;
use json;
use std::path::{Path, PathBuf};
use std::fs::File;
use std::io::Read;
use std::process;

pub fn install_local(log: &mut logger::Logger, file: &str, matches: &clap::ArgMatches<'_>) {

    // Determine where we install the package
    let spam_install_directory = if matches.is_present("install_directory") {
        PathBuf::from(matches.value_of("install_directory").unwrap())
    } else {
        directories::BaseDirs::new()
            .expect("Could not get home directory")
            .home_dir()
            .join(Path::new(".spam/packages"))
    };

    // Open the .TAR.GZ archive
    log.info("Opening package...");
    let opened_file = File::open(file)
        .expect(&format!("The file {} could not be read; did you misspell the file name?", file));
    let mut archive = tar::Archive::new(&opened_file);

    // Validate package name
    for entry in archive
        .entries()
        .expect(&format!("The file {} is not a valid .TAR.GZ archive, could not read its contents", file)) {

        let mut entry_unwrapped = entry.expect("Could not read file");
        let package_name_with_version = Path::new(file).file_stem().unwrap().to_str().unwrap();
        let mut package_name = package_name_with_version.clone();
        package_name = package_name.split("_").collect::<Vec<&str>>().get(0).unwrap();
        if entry_unwrapped.path().unwrap() == Path::new(package_name).join("spam.json") {
            let mut file_contents = String::new();
            entry_unwrapped.read_to_string(&mut file_contents).unwrap();
            let parsed = &json::parse(&file_contents).expect("The package metadata is not valid");
            if package_name_with_version != &format!("{}_{}", parsed["name"], parsed["version"])
                || &package_name != entry_unwrapped.path().unwrap().to_str().unwrap().split("/").collect::<Vec<&str>>().get(0).unwrap() {
                panic!("The package name is not valid");
            }
            // Prompt user for confirmation
            let dialog = dialoguer::Confirmation::new(&format!("Are you sure you want to install {} v{}?", parsed["name"], parsed["version"]));
            if dialog.interact().unwrap() {

                // Unpack the package into the install directory
                log.debug(&format!("Installing to {:?}", &spam_install_directory));
                tar::Archive::new(&opened_file).unpack(&spam_install_directory).unwrap();
                log.success("Package installed");
                process::exit(0);
            } else {
                panic!("Installation cancelled");
            }
        }
    }
    panic!("Package metadata is missing")
}

pub fn install_http(log: &mut logger::Logger, url: &str) {
    println!("http")
}

pub fn install(log: &mut logger::Logger, matches: &clap::ArgMatches<'_>) {
    let parsed_package = matches.value_of("package").unwrap().split("://").collect::<Vec<&str>>();
    match parsed_package.get(0).unwrap() {
        &"file" => self::install_local(log, parsed_package.get(1).unwrap(), matches),
        &"http" | &"https" => self::install_http(log, parsed_package.get(1).unwrap()),
        _ => log.error("The package name you supplied is not valid. Package names must start with 'http://', 'https://' or 'file://'")
    };
}
