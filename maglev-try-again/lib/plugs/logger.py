
from middleware import Connection, Plug

class LoggerPlug(Plug):
    mut = False

    def handle(self, conn: Connection):
        print(f"{conn.method} {conn.path} => {conn.status_code.name}")
