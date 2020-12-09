from flask import json
from datamanager import *



class Club():
    __slots__=('id','name','description','president_wxid','activity_list','member_list','manager_list')

    def __init__(self,club_id=0,club_name='',club_description='',club_president_wxid=''):
        self.id=club_id
        self.name=club_name
        self.description=club_description
        self.president_wxid=club_president_wxid
        self.activity_list=[]  #存储活动id
        self.member_list=[]    #存储成员微信号
        self.manager_list=[]   #存储管理者微信号

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
        activity_name_list=[]
        member_name_list=[]
        manager_name_list=[]
        manager1=DataManager(DataType.activity)
        manager2=DataManager(DataType.user)
        for acti_id in self.activity_list:
            acti=manager1.getInfo(acti_id)
            activity_name_list.append((acti_id,acti[0][1])) #表中每一项的第二个元素应该是name
        for user_id in self.member_list:
            user=manager2.getInfo(user_id)
            member_name_list.append((user_id,user[0][1])) 
        for user_id in self.manager_list:
            user=manager2.getInfo(user_id)
            manager_name_list.append((user_id,user[0][1])) 

        res={'status':'200 OK','club_id':self.id,'club_name':self.name,'club_description':self.description,
        'club_president_wxid':self.president_wxid,'club_members':member_name_list,'club_managers':manager_name_list,
        'club_activities':activity_name_list}
        return json.dumps(res)
        



if __name__=='__main__':
    pass
        

