from flask import json
from datamanager import *



class Club():
    def __init__(self,club_id=0,club_name='',club_description='',club_president_wxid='', picture_list=[]):
        self.id=club_id
        self.name=club_name
        self.description=club_description
        self.president_wxid=club_president_wxid
        self.activity_list=[]  #存储活动id
        self.member_list=[]    #存储成员微信号
        self.manager_list=[]   #存储管理者微信号
        self.picture_list=picture_list   #存储图片列表

    def change_president(self,new_president_wxid):
        self.president_wxid=new_president_wxid

    def change_description(self,new_description):
        self.description=new_description

    def change_name(self,new_name):
        self.name=new_name
        
    def add_manager(self,manager_wxid):
        if not manager_wxid in self.manager_list:
            self.manager_list.append(manager_wxid)

    def delete_manager(self, manager_wxid):
        if manager_wxid in self.manager_list:
            self.manager_list.remove(manager_wxid)

    def add_member(self,member_wxid):
        if not member_wxid in self.member_list:
            self.member_list.append(member_wxid)

    def delete_member(self,member_wxid):
        if member_wxid in self.member_list:
            self.member_list.remove(member_wxid)

    def add_activity(self,activity_id):
        if not activity_id in self.activity_list:
            self.activity_list.append(activity_id)

    def delete_activity(self,activity_id):
        if not activity_id in self.activity_list:
            self.activity_list.append(activity_id)



    def Jsonfy(self):
        res={'status':'200 OK','club_id':self.id,'club_name':self.name,'club_description':self.description,
        'club_president_wxid':self.president_wxid}
        return json.dumps(res)
        



if __name__=='__main__':
    pass
        

