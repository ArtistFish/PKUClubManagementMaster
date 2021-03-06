from flask import Flask, render_template, request, json
from club import Club
from datamanager import *
from message import *
from user import *
from activity import Activity
import random
import requests
import os
import time
import datetime

app = Flask(__name__)

# for test
@app.route("/gp10/test",methods=['GET','POST'])
def test_form():
    return "response from SE group 10"


'''
API:
create a user (用户注册)
'''
@app.route('/gp10/createUser', methods=['POST'])
def createUser():
    wxid = request.form.get("wx_id")
    name = request.form.get("user_name")
    head_url = request.form.get("head_url")
    datamanager = DataManager(DataType.user)
    res=datamanager.getInfo(wxid)
    if len(res)>0:
        return json.dumps({'status':'Rejected：Already exist'})
    user = User(wxid=wxid, name=name, head_url=head_url)
    datamanager.addInfo(user)

    res = {'status':'200 OK'}
    return json.dumps(res)



'''
API:
获取用户name和head_url
'''
@app.route('/gp10/getUserInfo', methods=['POST'])
def getUserInfo():
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.user)
    res=datamanager.getInfo(wxid)
    if len(res)==0:
        return json.dumps({'status':'Not Found'})
    user_name=res[0][2]
    head_url = res[0][3]
    res = {'status':'200 OK','user_name':user_name, 'head_url': head_url}
    return json.dumps(res)


'''
API:
更换用户name
'''
@app.route('/gp10/setUserInfo', methods=['POST'])
def setUserInfo():
    wxid = request.form.get("wx_id")
    name = request.form.get("user_name")
    user = User(wxid=wxid, name=name)
    datamanager = DataManager(DataType.user)
    datamanager.updateInfo(user)
    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
create a club
'''
@app.route('/gp10/createClub', methods=['POST'])
def createClub():
    club_name = request.form.get("club_name")
    club_description = request.form.get("club_description")
    club_president_wxid = request.form.get("club_president_user_id")
    club_picture_list = request.form.get("club_picture_list").split(',')

    club=Club(club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid,club_picture_list=club_picture_list)
    manager=DataManager(DataType.club)
    res=manager.getList()
    for idx in res:
        if idx[1]==club_name:
            return json.dumps({'status':'Rejected：Already exist'})

    manager.addInfo(club)
    res={'status':'200 OK'}
    return json.dumps(res)

'''
API:
delete a club
'''
@app.route('/gp10/deleteClub', methods=['POST'])
def deleteClub():
    club_id = int(request.form.get("club_id"))
    manager = DataManager(DataType.club)
    manager.deleteInfo(club_id)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
Function: getClubInfo(club_id) 
Return: {'status':status,'club_name': club_name, 'club_description':club_description,'club_president_user_id',club_president_user_id}

Return in Json format
********注意：该API只返回社团基本信息，关于人员、活动的信息请使用getClubManagers......
'''
@app.route('/gp10/getClubInfo', methods=['POST'])
def getClubInfo():
    club_id = int(request.form.get("club_id"))
    manager=DataManager(DataType.club)
    club_info=manager.getInfo(club_id)
    if len(club_info)==0:
        return json.dumps({'status:':'Not Found'})
    club=Club(club_id=club_id,club_name=club_info[0][1],club_description=club_info[0][2],club_president_wxid=club_info[0][3])
    res=club.Jsonfy()
    return res

'''
API: getClubManagers
获取社团骨干列表
'''
@app.route('/gp10/getClubManagers', methods = ['POST'])
def getClubManagers():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_managers)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_manager_list': res})

'''
API: getClubMembers
获取社团成员列表
'''
@app.route('/gp10/getClubMembers', methods = ['POST'])
def getClubMembers():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_members)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_member_list': res})

'''
API: getClubCollectors
获取社团收藏者列表
'''
@app.route('/gp10/getClubCollectors', methods = ['POST'])
def getClubCollectors():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_collectors)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status': '200 OK', 'club_collector_list': res})

'''
API: getClubActivities
获取社团活动列表
'''
@app.route('/gp10/getClubActivities', methods = ['POST'])
def getClubActivities():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_activities)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_activity_list': res})

'''
API: getClubPictures
获取社团图片列表
'''
@app.route('/gp10/getClubPictures', methods = ['POST'])
def getClubPictures():
    club_id = int(request.form.get("club_id"))
    datamanager = DataManager(DataType.club_pictures)
    res = datamanager.getSlaveList(club_id)
    return json.dumps({'status':'200 OK', 'club_pictures_list': res})

'''
API: addManagerToClub
向社团增加骨干
'''
@app.route('/gp10/addManagerToClub', methods = ['POST'])
def addManagerToClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_managers)
    res=datamanager.getSlaveList(club_id)
    for i in range(len(res)):
        if wxid==res[i][1]:
            return json.dumps({'status':'Already in the club! failed!'})
    datamanager.addSlaveInfo(club_id, wxid)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API: addMemberToClub
向社团增加成员
'''
@app.route('/gp10/addMemberToClub', methods = ['POST'])
def addMemberToClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_members)
    res=datamanager.getSlaveList(club_id)
    for i in range(len(res)):
        if wxid==res[i][1]:
            return json.dumps({'status':'Already in the club! failed!'})

    datamanager.addSlaveInfo(club_id, wxid)
    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: addCollectorToClub
向社团增加收藏者
'''
@app.route('/gp10/addCollectorToClub', methods = ['POST'])
def addCollectorToClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_collectors)
    res = datamanager.getSlaveList(club_id)
    for i in range(len(res)):
        if wxid==res[i][1]:
            return json.dumps({'status':'Already in the club! failed!'})

    datamanager.addSlaveInfo(club_id, wxid)
    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: addPictureToClub
向社团添加图片
'''
@app.route('/gp10/addPictureToClub', methods = ['POST'])
def addPictureToClub():
    club_id = int(request.form.get("club_id"))
    filepath = request.form.get("filepath")
    datamanager = DataManager(DataType.club_pictures)
    datamanager.addSlaveInfo(club_id, filepath)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: addActivityToClub
【警告：此API已被废弃，请使用createActivity API！】
向社团增加活动

@app.route('/gp10/addActivityToClub', methods = ['POST'])
def addActivityToClub():
    club_id = int(request.form.get("club_id"))
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.club_activities)
    datamanager.addSlaveInfo(club_id, activity_id)

    res = {'status':'200 OK'}
    return json.dumps(res)
'''

'''
API: deleteManagerFromClub
从社团删除骨干
'''
@app.route('/gp10/deleteManagerFromClub', methods = ['POST'])
def deleteManagerFromClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_managers)
    datamanager.deleteSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deletePictureFromClub
从社团删除图片
'''
@app.route('/gp10/deletePictureFromClub', methods = ['POST'])
def deletePictureFromClub():
    club_id = int(request.form.get("club_id"))
    filepath = request.form.get("filepath")
    datamanager = DataManager(DataType.club_pictures)
    datamanager.deleteSlaveInfo(club_id, filepath)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deleteMemberFromClub
从社团删除成员
'''
@app.route('/gp10/deleteMemberFromClub', methods = ['POST'])
def deleteMemberFromClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_members)
    datamanager.deleteSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deleteCollectorFromClub
从社团删除收藏者
'''
@app.route('/gp10/deleteCollectorFromClub', methods = ['POST'])
def deleteCollectorFromClub():
    club_id = int(request.form.get("club_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.club_collectors)
    datamanager.deleteSlaveInfo(club_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: deleteActivityFromClub
【警告：此API已被废弃，请使用deleteActivity API！】
从社团删除活动

@app.route('/gp10/deleteActivityFromClub', methods = ['POST'])
def deleteActivityFromClub():
    club_id = int(request.form.get("club_id"))
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.club_activities)
    datamanager.deleteSlaveInfo(club_id, activity_id)

    res = {'status': '200 OK'}
    return json.dumps(res)
'''

'''
API:setClubInfo
设定社团信息
'''
@app.route('/gp10/setClubInfo', methods=['POST'])
def setClubInfo():
    club_id = int(request.form.get("club_id"))
    club_name = request.form.get("club_name")
    club_description = request.form.get("club_description")
    club_president_wxid = request.form.get("club_president_user_id")
    club=Club(club_id=club_id,club_name=club_name,club_description=club_description,club_president_wxid=club_president_wxid)
    manager=DataManager(DataType.club)
    manager.updateInfo(club)
    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:getClubList
获取社团列表
'''
@app.route('/gp10/getClubList', methods=['POST','GET'])
def getClubList():
    manager=DataManager(DataType.club)
    res=manager.getList()
    club_list=[]
    for club in res:
        club_list.append((club[0],club[1]))
    return json.dumps({'status':'200 OK','club_list':club_list})

'''
API:getRelatedClubList
输入关键字keyword，返回相关的社团
'''
@app.route('/gp10/getRelatedClubList', methods=['POST'])
def getRelatedClubList():
    keyword = request.form.get("keyword")
    manager=DataManager(DataType.club)
    res=manager.getList()
    related_club_list=[]
    for club in res:
        if keyword in club[1] or keyword in club[2]:
            related_club_list.append((club[0],club[1]))
    return json.dumps({'status':'200 OK','related_club_list':related_club_list})

'''
API: getClubListOfUser
输入用户wxid，返回用户加入的社团
'''
@app.route('/gp10/getClubListOfUser', methods=['POST'])
def getClubListOfUser():
    wxid = request.form.get("wx_id")

    # 获取用户作为社长的社团
    president_club_list = []
    datamanager = DataManager(DataType.club)
    res = datamanager.getList()
    for club in res:
        if club[3] == wxid:
            president_club_list.append((club[0], club[1]))

    #获取用户作为骨干的社团
    manager_club_list = []
    for club in res:
        club_id = club[0]
        datamanager_club_managers = DataManager(DataType.club_managers)
        res_club_managers = datamanager_club_managers.getSlaveList(club_id)

        for manager in res_club_managers:
            if manager[1] == wxid:
                manager_club_list.append((club[0], club[1]))

    #获取用户作为成员的社团
    member_club_list = []
    for club in res:
        club_id = club[0]
        datamanager_club_members = DataManager(DataType.club_members)
        res_club_members = datamanager_club_members.getSlaveList(club_id)

        for member in res_club_members:
            if member[1] == wxid:
                member_club_list.append((club[0], club[1]))

    #获取用户收藏的社团
    collect_club_list = []
    for club in res:
        club_id = club[0]
        datamanager_club_collectors = DataManager(DataType.club_collectors)
        res_club_collectors = datamanager_club_collectors.getSlaveList(club_id)

        for collector in res_club_collectors:
            if collector[1] == wxid:
                collect_club_list.append((club[0], club[1]))

    return json.dumps({'status': '200 OK', 'president_club_list': president_club_list,
                       'manager_club_list': manager_club_list, 'member_club_list': member_club_list,
                       'collector_club_list': collect_club_list})

'''
API: registerUserToActivity
用户注册某一活动
'''
@app.route('/gp10/registerUserToActivity', methods = ['POST'])
def registerUserToActivity():
    wxid = request.form.get("wx_id")
    activity_id = int(request.form.get("activity_id"))

    flag = 0
    # 只有用户是社团的社长/骨干/成员，才能报名社团的活动
    datamanager = DataManager(DataType.activity)
    activity_info = datamanager.getInfo(activity_id)
    club_id = activity_info[0][3]

    datamanager = DataManager(DataType.club)
    club_info = datamanager.getInfo(club_id)
    if wxid == club_info[0][3]:
        flag = 1

    datamanager = DataManager(DataType.club_managers)
    res_club_managers = datamanager.getSlaveList(club_id)
    for manager in res_club_managers:
        if manager[1] == wxid:
            flag = 1

    datamanager = DataManager(DataType.club_members)
    res_club_members = datamanager.getSlaveList(club_id)
    for member in res_club_members:
        if member[1] == wxid:
            flag = 1

    if flag == 0:
        return json.dumps({'status': 'Rejected: User is not member of the club'})

    datamanager = DataManager(DataType.activity_registered_people)
    res=datamanager.getSlaveList(activity_id)
    for member in res:
        if member[1]==wxid:
            return json.dumps({'status': 'Rejected: Already registered'})
    datamanager.addSlaveInfo(activity_id, wxid)
    return json.dumps({'status': '200 OK'})

'''
API: addCollectorToActivity
用户收藏某一活动
'''
@app.route('/gp10/addCollectorToActivity', methods = ['POST'])
def addCollectorToActivity():
    wxid = request.form.get("wx_id")
    activity_id = int(request.form.get("activity_id"))

    datamanager = DataManager(DataType.activity_collectors)
    res = datamanager.getSlaveList(activity_id)
    for member in res:
        if member[1]==wxid:
            return json.dumps({'status': 'Rejected: Already collected'})
    datamanager.addSlaveInfo(activity_id, wxid)
    return json.dumps({'status': '200 OK'})

'''
API: deleteCollectorFromActivity
用户取消收藏某一活动
'''
@app.route('/gp10/deleteCollectorFromActivity', methods = ['POST'])
def deleteCollectorFromActivity():
    activity_id = int(request.form.get("activity_id"))
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.activity_collectors)
    datamanager.deleteSlaveInfo(activity_id, wxid)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: getActivityCollectors
获取收藏某一活动的用户
'''
@app.route('/gp10/getActivityCollectors', methods = ['POST'])
def getActivityCollectors():
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.activity_collectors)
    res = datamanager.getSlaveList(activity_id)
    return json.dumps({'status': '200 OK', 'activity_collector_list': res})

'''
API: getActivityListOfUser
输入用户wxid，返回用户报名和被选中的活动
'''
@app.route('/gp10/getActivityListOfUser', methods = ['POST'])
def getActivityListOfUser():
    wxid = request.form.get("wx_id")
    datamanager = DataManager(DataType.activity)
    res = datamanager.getList()

    #获取用户报名的活动
    registered_activity_list = []
    for activity in res:
        activity_id = activity[0]
        datamanager_activity_registered_people = DataManager(DataType.activity_registered_people)
        res_activity_registered_people = datamanager_activity_registered_people.getSlaveList(activity_id)

        for user in res_activity_registered_people:
            if user[1] == wxid:
                registered_activity_list.append((activity[0], activity[1]))

    #获取用户被选中的活动
    selected_activity_list = []
    for activity in res:
        activity_id = activity[0]
        datamanager_activity_selected_people = DataManager(DataType.activity_selected_people)
        res_activity_selected_people = datamanager_activity_selected_people.getSlaveList(activity_id)

        for user in res_activity_selected_people:
            if user[1] == wxid:
                selected_activity_list.append((activity[0], activity[1]))

    #获取用户收藏的活动
    collected_activity_list = []
    for activity in res:
        activity_id = activity[0]
        datamanager_activity_collectors = DataManager(DataType.activity_collectors)
        res_activity_collectors = datamanager_activity_collectors.getSlaveList(activity_id)

        for user in res_activity_collectors:
            if user[1] == wxid:
                collected_activity_list.append((activity[0], activity[1]))

    return json.dumps({'status': '200 OK', 'registered_activity_list': registered_activity_list,
                       'selected_activity_list': selected_activity_list, 'collected_activity_list': collected_activity_list})


'''
API:
Function: sendMessage(wx_id_sender, wx_id_receiver, type, title, content)
Return: {'status': status}
'''
@app.route('/gp10/sendMessage', methods = ['POST'])
def sendMessage():
    message_type = request.form.get("type")
    message_title = request.form.get("title")
    message_content = request.form.get("content")
    message_sender_wxid = request.form.get("wx_id_sender")
    message_receiver_wxid = request.form.get("wx_id_receiver")

    #判断type是否符合规定
    type_list = ['0', '1', '2', '5', '10', 'inform_normal', 'inform_managerInvite', 'inform_presidentExchange', 
                'reply_normal', 'system_normal']
    if not message_type in type_list :
        myError = {'status':'400 TYPE_ERROR'}
        return json.dumps(myError)

    message = Message(message_type=message_type, message_title=message_title, message_content=message_content,
                      message_sender_wxid=message_sender_wxid, message_receiver_wxid=message_receiver_wxid)
    manager = DataManager(DataType.message)
    manager.addInfo(message)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:
更新message
'''
@app.route('/gp10/setMessageInfo', methods = ['POST'])
def setMessageContent():
    message_id = int(request.form.get("message_id"))
    message_type = request.form.get("type")
    message_title = request.form.get("title")
    message_content = request.form.get("content")
    message_sender_wxid = request.form.get("wx_id_sender")
    message_receiver_wxid = request.form.get("wx_id_receiver")

    # 判断type是否符合规定
    type_list = ['0', '1', '2', '5', '10', 'inform_normal', 'inform_managerInvite', 'inform_presidentExchange',
                 'reply_normal', 'system_normal']
    if not message_type in type_list:
        myError = {'status': '400 TYPE_ERROR'}
        return json.dumps(myError)

    message = Message(message_id=message_id, message_type=message_type, message_title=message_title, message_content=message_content,
                      message_sender_wxid=message_sender_wxid, message_receiver_wxid=message_receiver_wxid)
    datamanager = DataManager(DataType.message)
    datamanager.updateInfo(message)

    res = {'status': '200 OK'}
    return json.dumps(res)


'''
API:
Function: getMessages(wx_id)
Return: {status: ‘’, send_message_list: [ {id: '', type: ‘’, title: ‘’, content: ‘’, sender: ‘’, receiver: ‘’} , …], 
    receive_message_list: [ {id: '', type: ‘’, title: ‘’, content: ‘’, sender: ‘’, receiver: ‘’} , …]}
其中send_message_list包含该wx_id发出的信息，receive_message_list包含该wx_id收到的信息

Return in JSON format
'''
@app.route('/gp10/getMessages', methods = ['POST'])
def getMessages():
    wxid = request.form.get("wx_id")
    message_list_of_user = MessageListOfUser(wxid=wxid)
    return json.dumps(message_list_of_user.__dict__)


'''
API:
Function: addActivityPicture
向活动添加图片
'''
@app.route('/gp10/addActivityPicture', methods = ['POST'])
def addActivityPicture():
    activity_id = int(request.form.get("activity_id"))
    filepath = request.form.get("filepath")
    datamanager = DataManager(DataType.activity_pictures)
    datamanager.addSlaveInfo(activity_id, filepath)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API: getActivityPictures
获取活动图片列表
'''
@app.route('/gp10/getActivityPictures', methods = ['POST'])
def getActivityPictures():
    activity_id = int(request.form.get("activity_id"))
    datamanager = DataManager(DataType.activity_pictures)
    res = datamanager.getSlaveList(activity_id)
    return json.dumps({'status':'200 OK', 'activity_pictures_list': res})

'''
API: deletePictureFromClub
删除活动图片
'''
@app.route('/gp10/deletePictureFromActivity', methods = ['POST'])
def deletePictureFromActivity():
    activity_id = int(request.form.get("activity_id"))
    filepath = request.form.get("filepath")
    datamanager = DataManager(DataType.activity_pictures)
    datamanager.deleteSlaveInfo(activity_id, filepath)

    res = {'status': '200 OK'}
    return json.dumps(res)

'''
API:
Function: getActivityInfo(Activity_id)
return:{'status':status, 'activity_name':activity_name, 'activity_description':description, 'activity_club_id':club_id,
'activity_place':place, 'activity_start_time':start_time, 'activity_end_time':end_time, 'activity_lottery_time':lottery_time,
'activity_lottery_method':lottery_method, 'activity_max_number':max_number, 'activity_registered_people':registered_people,
'activity_selected_people':selected_people, 'activity_fee':fee, 'activity_sign_up_ddl':sign_up_ddl,
'activity_sponsor':sponsor, 'activity_undertaker':undertaker }
Return in Json format

返回的是Activity的json化，如果需要返回其他属性，需要修改Activity类的属性及方法
注意：会返回registered_people和selected_people，内容为wxid,但不会返回picture_list!
'''
@app.route('/gp10/getActivityInfo', methods=['POST'])
def getActivityInfo():
    activity_id = int(request.form.get("activity_id"))
    manager = DataManager(DataType.activity)
    activity_info = manager.getInfo(activity_id)
    if len(activity_info) == 0 :
        return json.dumps({'status':'Not Found'})

    activity = Activity(at_id=activity_id, at_name=activity_info[0][1], at_description=activity_info[0][2], 
    at_club_id=activity_info[0][3], at_place=activity_info[0][4], at_start_time=activity_info[0][5], 
    at_end_time=activity_info[0][6], at_lottery_time=activity_info[0][7], at_lottery_method=activity_info[0][8], 
    at_max_number=activity_info[0][9], at_fee=activity_info[0][10], at_sign_up_ddl=activity_info[0][11],
    at_sponsor=activity_info[0][12], at_undertaker=activity_info[0][13])

    activity.load_slave_data()  
    
    res = activity.Jsonfy()

    return res

'''
API:
Function: getActivityList()
Return: ActivityList

list中每一项包含id和name
'''
@app.route('/gp10/getActivityList', methods=['POST','GET'])
def getActivityList():
    manager = DataManager(DataType.activity)
    li = manager.getList()
    activity_list = []
    for activity in li:
        activity_list.append((activity[0], activity[1]))
    
    return json.dumps({'status':'200 OK', 'activity_list':activity_list})


'''
API:createActivity
创建一个活动，并添加进社团
Function: createActivity(name,description,club_id,place,start_time,end_time,lottery_time,lottery_method,max_number,
                        fee,sign_up_ddl,sponsor,undertaker,activity_picture_list)
return: {status,id} in JSON format
'''
@app.route('/gp10/createActivity',methods=['POST'])
def createActivity():
    activity_name = request.form.get("name")
    activity_description = request.form.get("description")
    activity_club_id = int(request.form.get("club_id"))
    activity_place = request.form.get("place")
    activity_start_time = request.form.get("start_time")
    activity_end_time = request.form.get("end_time")
    activity_lottery_time = request.form.get("lottery_time")
    activity_lottery_method = request.form.get("lottery_method")
    activity_max_number = int(request.form.get("max_number"))
    activity_fee = float(request.form.get("fee"))
    activity_sign_up_ddl = request.form.get("sign_up_ddl")
    activity_sponsor = request.form.get("sponsor")
    activity_undertaker = request.form.get("undertaker")
    activity_picture_list = request.form.get("activity_picture_list").split(',')

    newActivity = Activity(at_name=activity_name, at_description=activity_description, at_club_id=activity_club_id,
    at_place=activity_place, at_start_time=activity_start_time, at_end_time=activity_end_time,
    at_lottery_time=activity_lottery_time, at_lottery_method=activity_lottery_method,at_max_number=activity_max_number,
    at_fee=activity_fee, at_sign_up_ddl=activity_sign_up_ddl, at_sponsor=activity_sponsor,
    at_undertaker=activity_undertaker, activity_picture_list=activity_picture_list)

    manager = DataManager(DataType.activity)
    manager.addInfo(newActivity)

    #执行addActivityToClub操作
    manager2 = DataManager(DataType.club_activities)
    manager2.addSlaveInfo(activity_club_id, newActivity.id)

    res = {'status':'200 OK', 'id':newActivity.id}
    return json.dumps(res)


'''
API: setActivityInfo
Function: setActivityInfo(id,name,description,club_id,place,start_time,end_time,lottery_time,lottery_method,max_number,
                            fee,sign_up_ddl,sponsor,undertaker)
return:{status} in JSON format
'''
@app.route('/gp10/setActivityInfo', methods=['POST'])
def setActivityInfo():
    activity_id = int(request.form.get("id"))
    activity_name = request.form.get("name")
    activity_description = request.form.get("description")
    activity_club_id = int(request.form.get("club_id"))
    activity_place = request.form.get("place")
    activity_start_time = request.form.get("start_time")
    activity_end_time = request.form.get("end_time")
    activity_lottery_time = request.form.get("lottery_time")
    activity_lottery_method = request.form.get("lottery_method")
    activity_max_number = int(request.form.get("max_number"))
    activity_fee = float(request.form.get("fee"))
    activity_sign_up_ddl = request.form.get("sign_up_ddl")
    activity_sponsor = request.form.get("sponsor")
    activity_undertaker = request.form.get("undertaker")
    
    myActivity = Activity(at_id=id, at_name=activity_name, at_description=activity_description, at_club_id=activity_club_id,
    at_place=activity_place, at_start_time=activity_start_time, at_end_time=activity_end_time,
    at_lottery_time=activity_lottery_time, at_lottery_method=activity_lottery_method,at_max_number=activity_max_number,
    at_fee=activity_fee, at_sign_up_ddl=activity_sign_up_ddl, at_sponsor=activity_sponsor, at_undertaker=activity_undertaker)

    manager = DataManager(DataType.activity)
    manager.updateInfo(myActivity)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API: deleteActivity
删除一个活动，并从社团当中去掉这个活动
Function: deleteActivity(id)
return:{status} in JSON format
'''
@app.route('/gp10/deleteActivity', methods=['POST'])
def deleteActivity():
    id = int(request.form.get("id"))
    manager = DataManager(DataType.activity)
    #manager.deleteInfo(id)

    #查找activity_club_id
    myActivity = manager.getInfo(id)
    club_id = myActivity[0][3]

    #执行deleteActivityFromClub
    dtmanager = DataManager(DataType.club_activities)
    dtmanager.deleteSlaveInfo(club_id, id)

    manager.deleteInfo(id)

    res = {'status':'200 OK'}
    return json.dumps(res)

'''
API:getRandomClubList
获取随机排列的社团列表，暂且作为推荐社团的备选初级方案之一，后面再行修改使用
Function: getRandomClubList()
return: {status,club_list} in JSON format
club_list包含每个社团的id和name
'''
def getRandomClubList():
    manager = DataManager(DataType.club)
    all_club_list = manager.getList()
    club_list=[]

    for club in all_club_list:
        club_list.append((club[0],club[1]))
    
    #随机打乱顺序
    random.shuffle(club_list)

    return json.dumps({'status':'200 OK','club_list':club_list})

'''
API:getOpenid
Function:getOpenid(js_code)
return: {status,openid}
'''
@app.route('/gp10/getOpenid', methods=['POST'])
def getOpenid():
    url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb668543108717363'
    url += '&secret=c1b9e0873c7dd1cf79553828484e1b89'
    url += '&grant_type=authorization_code'

    js_code = str(request.form.get("js_code"))
    url += '&js_code=' + js_code
    
    tmp = requests.get(url=url)
    res = tmp.content
    output_text = tmp.text
    return json.dumps({'status': '200 OK', 'openid': output_text})
    #return json.dumps({'status': '200 OK'})

'''
API:updatePicture
Function:updatepicture()
return: {status,url}
'''
@app.route('/gp10/updatePicture', methods=['POST'])
def updatePicture():
    pic_obj = request.files.get('filename')
    pic_randnum = str(random.randint(1,10000000))
    file_path = '/home/images/' + pic_randnum + pic_obj.filename + '.jpg'

    path_return = '/images/' + pic_randnum + pic_obj.filename + '.jpg'

    pic_obj.save(file_path)

    res = {'status':'200 OK', 'filepath': path_return}
    return json.dumps(res)


'''
API:getClubListByMemberNum
获取社团列表，按社团成员人数降序排列
作为备选，方便社团推荐方案
Function:getClubListByMemerNum()
return: {status,club_list}
club_list 包含id,name,成员人数
'''
def getClubListByMemberNum():

    manager = DataManager(DataType.club)
    member_manager = DataManager(DataType.club_members)

    all_club_list = manager.getList()
    club_list=[]

    for club in all_club_list:
        club_member_list = member_manager.getSlaveList(club[0])
        club_member_num = len(club_member_list)
        club_list.append((club[0],club[1],club_member_num))

    club_list = sorted(club_list, key=lambda myClub:myClub[2], reverse=True)
    
    return json.dumps({'status':'200 OK','club_list':club_list})

'''
  Check if it is the time to start a lottery.
  Not for the front-end
  不要调用这个API
'''
@app.route('/gp10/checkLottery', methods=['GET','POST'])
def checkLottery():
    manager = DataManager(DataType.activity)
    activity_info = manager.getList()
    now_time=datetime.datetime.now().strftime('%F %T')
    format_regex = '%Y-%m-%d %H:%M:%S'
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'


    for i in range(len(activity_info)):
        scheduled_time=str(activity_info[i][7])
        if (now_time<scheduled_time):
            continue

        activity=Activity(at_id=activity_info[i][0], at_name=activity_info[i][1], at_description=activity_info[i][2], 
            at_club_id=activity_info[i][3], at_place=activity_info[i][4], at_start_time=activity_info[i][5], 
            at_end_time=activity_info[i][6], at_lottery_time=activity_info[i][7], at_lottery_method=activity_info[i][8], 
            at_max_number=activity_info[i][9], at_fee=activity_info[i][10], at_sign_up_ddl=activity_info[i][11],
            at_sponsor=activity_info[i][12], at_undertaker=activity_info[i][13] )
        activity.load_slave_data()
        if len(activity.selected_people_list)>0:
            continue
        activity.lottery_by_random_method()

        manager = DataManager(DataType.activity_selected_people)
        msgmanager = DataManager(DataType.message)
        for j in activity.selected_people_list:
            manager.addSlaveInfo(activity.id,j)


            #发送通知消息
            message = Message(message_type='system_normal', message_title='Congratulations！', message_content='You have joined the activity %s successfully'%(activity_info[i][1]),
                message_sender_wxid=j, message_receiver_wxid=j)
            msgmanager.addInfo(message)

    return "200 OK"
        





if __name__ == '__main__':
    app.run(debug=True, threaded=True,host='0.0.0.0',port=5000)
