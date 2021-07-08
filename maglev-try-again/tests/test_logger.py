
from middleware import Status, Connection
from plugs.logger import LoggerPlug

conn = Connection(
    "GET",
    "/",
    "HTTP/2.0",
    {"Content-Type": "text/html"},
    "Hello, World!"
)
conn.status_code = Status.OK

def test_logger(capsys):
    p = LoggerPlug()
    p.handle(conn)
    stdout, stderr = capsys.readouterr()
    assert stdout == "GET / => OK\n"
