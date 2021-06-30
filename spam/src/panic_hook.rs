
use logger;
use std::panic;

pub fn set_panic_hook(is_debug: bool, prefix: &'static str) { 
    panic::set_hook(Box::new(move |panic_info| {
        let log = logger::Logger { is_debug: is_debug, prefix: prefix };
        let payload = panic_info.payload().downcast_ref::<&str>();
        let message = panic_info.message();
        let mut output = match (payload, message) {
            (Some(payload), None) => format!("{}", payload),
            (None, Some(message)) => format!("{}", message),
            _ => String::from("")
        };
        if !is_debug {
            output = output.split(":").collect::<Vec<&str>>().get(0).unwrap().to_string();
            log.error(&format!("{}", output));
        } else {
            // Debug mode: output everything
            log.error(&format!("DEBUG: {:?}", payload));
            log.error(&format!("DEBUG: {:?}", message));
        }
    }));
}
