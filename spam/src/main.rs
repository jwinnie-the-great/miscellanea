
#![feature(panic_info_message)]

#[macro_use]
extern crate json;
extern crate clap;

mod panic_hook;
mod logger;
mod install;

fn main() {
    let mut log = logger::Logger { is_debug: false, prefix: "spam" };
    let matches = clap::App::new("Spam Package Manager")
        .version("0.1.0")
        .author("Jeremy Potter <git@stormdesign.us>")
        .about("Cross-platform package manager for the 21st century")
        .subcommand(clap::SubCommand::with_name("get")
            .about("Install a package")
            .arg(clap::Arg::with_name("debug")
                .short("d")
                .long("debug")
                .help("Print verbose debug output"))
            .arg(clap::Arg::with_name("install_directory")
                 .long("install-directory")
                 .help("Directory to install packages")
                 .takes_value(true)
                 .value_name("install_directory"))
            .arg(clap::Arg::with_name("package")
                 .help("Package to install (prefix local packages with 'file://')")
                 .required(true)
                 .index(1)))
        .get_matches();
    if let Some(matches) = matches.subcommand_matches("get") {
        log.is_debug = matches.is_present("debug");
        panic_hook::set_panic_hook(log.is_debug.clone(), log.prefix.clone());
        install::install(&mut log, matches);
    }
}
