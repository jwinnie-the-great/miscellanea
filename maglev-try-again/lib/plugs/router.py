
from typing import Dict

from middleware import Plug

class Path():
    def __init__(path: str):
        self.path = path
    

RoutingTable = Dict[path]

class RouterPlug(Plug):
    mut = True

    def __init__(self, connection_table: ConnectionTable):

    def handle()
