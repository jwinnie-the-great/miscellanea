
from enum import Enum
from typing import Dict, Any
from abc import *

class Status(Enum):
    NOT_FOUND = 404
    ERROR = 500
    OK = 200

class Connection:
    status_code: int
    method: str
    path: str
    http_version: str
    headers: Dict[Any, Any]
    body: Any

    def __init__(self, method, path, http_version, headers, body):
        self.method = method
        self.path = path
        self.http_version = http_version
        self.headers = headers
        self.body = body
        self.status_code = Status.NOT_FOUND

class Plug(metaclass=ABCMeta):
    mut: bool

    @abstractmethod
    def handle(self, conn: Connection):
        raise NotImplementedError()
