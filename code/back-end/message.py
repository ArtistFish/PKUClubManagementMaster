from flask import json
from datamanager import *

class Message():
    #__slots__ = ('id', 'type', 'title', 'content', 'sender_wxid', 'receiver_wxid')

    def __init__(self, message_id = 0, message_type = '', message_title = '', message_content = '',
                 message_sender_wxid = '', message_receiver_wxid = ''):
                 #message_sender_wxid = '', message_receiver_wxid = '', message_isRead = False):
        self.id = message_id
        self.type = message_type
        self.title = message_title
        self.content = message_content
        self.sender_wxid = message_sender_wxid
        self.receiver_wxid = message_receiver_wxid
        #self.isRead = message_isRead
    
    #def changeIsRead(self, new_state = True):
    #    self.isRead = new_state

class MessageListOfUser():
    #__slots__ = {'status', 'send_message_list', 'receive_message_list'}

    def __init__(self, wxid):
        self.status = '200 OK'
        datamanager = DataManager(DataType.message)
        self.send_message_list = datamanager.getList(wxid=wxid, flag=1)
        self.receive_message_list = datamanager.getList(wxid=wxid, flag=2)
