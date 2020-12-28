from flask import json
from datamanager import *

class User():
    #__slots__ = ('wxid', 'name')

    def __init__(self, wxid='', name='', head_url=''):
        self.wxid = wxid
        self.name = name
        self.head_url = head_url
