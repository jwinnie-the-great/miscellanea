
from lib.middleware import Plug, Connection

class TestPlug(Plug):
    mut = True

    def handle(self, conn: Connection):
        return conn

conn = Connection(
    "GET",
    "/",
    "HTTP/2.0",
    {"Content-Type": "text/html"},
    "Hello, World!"
)

def test_plugs():
    a = TestPlug()
    assert a.handle(conn) == conn
