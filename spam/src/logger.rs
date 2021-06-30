
extern crate colored;
extern crate std;

use self::colored::*;

#[derive(Clone)]
pub struct Logger<'a> {
    pub is_debug: bool,
    pub prefix: &'a str
}

impl<'a> Logger<'a> {
    pub fn debug(&self, message: &str) {
        if self.is_debug {
            println!("{} {} {}", self.prefix, "debug".blue(), message);
        }
    }
    pub fn success(&self, message: &str) {
        println!("{} {} {}", self.prefix, "success".green(), message);
    }
    pub fn warning(&self, message: &str) {
        eprintln!("{} {} {}", self.prefix, "warning".yellow(), message);
    }
    /// Make sure you clean up before calling this function! Will exit promptly without cleaning up.
    pub fn error(&self, message: &str) {
        eprintln!("{} {} {}", self.prefix, "error".red(), message);
    }
    pub fn info(&self, message: &str) {
        println!("{} {} {}", self.prefix, "info".blue(), message);
    }
}
