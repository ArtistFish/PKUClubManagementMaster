'''
Temporarily use sqlite3 for debug
Probably can satisfy our needs
'''
import sqlite3
#import mysql.connector

class Club():
    def __init__():
        '''
        not used
        '''
        self.president = new_president
        self.managerList=[]
        self.memberList=[]
        self.activityList = []

    def createClub(new_id,new_name,new_president='',new_description='',new_ico='',new_picture=''):
        conn = sqlite3.connect('test.db')
        cursor = conn.cursor()
        str='insert into clubs (id, name, description,president,ico,picture) values (%d, \'%s\',\'%s\',\'%s\',\'%s\',\'%s\')'%(new_id,new_name,new_description,new_president,new_ico,new_picture)         
        #社团基本信息
        cursor.execute(str) 
        res=cursor.rowcount
        

        str='create table club%dactivitylist (acti_id int)'%(new_id) #社团活动表，记录活动编号
        cursor.execute(str)
        str='create table club%dmemberlist (member_id varchar)'%(new_id)#社团成员表，记录成员微信号
        cursor.execute(str)
        str='create table club%dmanagerlist (manager_id varchar)'%(new_id)#社团管理者表，记录管理者微信号
        cursor.execute(str)

        cursor.close()
        conn.commit()
        conn.close()
        return res

    def updateClubInfo(new_id,new_name,new_prisident='',new_description='',new_ico='',new_picture=''):
        conn = sqlite3.connect('test.db')
        cursor = conn.cursor()
        str='update clubs set name=\'%s\',description=\'%s\',president=\'%s\',ico=\'%s\',picture=\'%s\' where id=%d'%(new_name,new_description,id)
        cursor.execute(str)
        res=cursor.rowcount

        cursor.close()
        conn.commit()
        conn.close()
        return res
       

    def deleteClub(club_id):
        conn = sqlite3.connect('test.db')
        cursor = conn.cursor()
        str='delete from clubs where id=%d'%(club_id)
        cursor.execute(str)
        str='drop table club%dactivitylist'%(club_id)
        cursor.execute(str)
        str='drop table club%dmemberlist'%(club_id)
        cursor.execute(str)
        res=cursor.rowcount

        cursor.close()
        conn.commit()
        conn.close()
        return res

    def getClubInfo(club_id):
        conn = sqlite3.connect('test.db')
        cursor = conn.cursor()
        str='select * from clubs where id=%d'%(club_id)
        cursor.execute(str)
        res = cursor.fetchall()
        #print(res)
        cursor.close()
        conn.close()
        return res



    def addManager(self,new_manager):
        if not new_manager in self.managerList:
            self.managerList.append(new_manager)
    
    def deleteManager(self,old_manager):
        if old_manager in self.managerList:
            self.managerList.remove(old_manager)

    def addMember(self,new_member):
        if not new_member in self.memberList:
            self.memberList.append(new_member)
    
    def deleteMember(self,old_member):
        if old_member in self.memberList:
            self.memberList.remove(old_member)

    def addActivity(self,new_activity):
        if not new_activity in self.activityList:
            self.activityList.append(new_activity)
    
    def deleteActivity(self,old_activity):
        if old_activity in self.activityList:
            self.activityList.remove(old_activity)

    def changeDescription(self,new_description):
        self.description=new_description

    def sendNotice(self):
        pass
    



if __name__=='__main__':
    pass
        

