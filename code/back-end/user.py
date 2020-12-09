from flask import json
from datamanager import *

class User():
    #__slots__ = ('wxid', 'name')

    def __init__(self, wxid='', name=''):
        self.wxid = wxid
        self.name = name
