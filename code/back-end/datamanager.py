from enum import Enum
import mysql.connector

# 枚举类型，枚举了DataManager的datatype属性可能具有的值
class DataType(Enum):
    club = 1
    activity = 2
    user = 3
    message = 4

# DataManager类，从事数据库访问。使用时，应先根据需要构造实例，指定datatype的值，再调用相关方法。
class DataManager():
    datatype: DataType

    def __init__(self, datatype):
        self.datatype = datatype

    # 获取数据库表某一行的信息
    def getInfo(self, id):
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("select * from clubs where club_id=%d" % id)
            elif self.datatype == DataType.activity:
                cursor.execute("select * from activities where activity_id=%d" % id)
            elif self.datatype == DataType.user:
                cursor.execute("select * from users where wxid='%s'" % id) #这里应该为wxid，传入的id类型应该是%s
            else:
                cursor.execute("select * from messages where message_id=%d" % id)
        except mysql.connector.errors.ProgrammingError:
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res

    # 获取某一张数据库表的信息
    def getList(self):
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("select * from clubs")
            elif self.datatype == DataType.activity:
                cursor.execute("select * from activities")
            elif self.datatype == DataType.user:
                cursor.execute("select * from users")
            else:
                cursor.execute("select * from messages")
        except mysql.connector.errors.ProgrammingError:
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res

    # 为某一张数据表添加一行记录
    def addInfo(self, object):
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()

        try:
            if self.datatype == DataType.club:
                cursor.execute("insert into clubs (club_name, club_description, club_president_wxid) "
                               "values ('%s','%s', '%s')" % (object.name, object.description, object.president_wxid))
                object.id = cursor.lastrowid # 把得到的自增id赋给对象中的id属性
                # 创建每一个club对应的几个附庸数据表
                cursor.execute("create table club_%d_managers (manager_wxid TINYTEXT primary key)" % object.id)
                cursor.execute("create table club_%d_members (member_wxid TINYTEXT primary key)" % object.id)
                cursor.execute("create table club_%d_activities (activity_id INT primary key)" % object.id)
            elif self.datatype == DataType.activity:
                cursor.execute("insert into activities (activity_name, activity_description, activity_club_id, activity_place, "
                               "activity_start_time, activity_end_time, activity_lottery_time, activity_lottery_method, activity_max_number) "
                               "values ('%s', '%s', %d, '%s', "
                               "'%s', '%s', '%s', '%s', %d)" % (object.name, object.description, object.clubID, object.place,
                                                        object.startTime, object.endTime, object.lotteryTime, object.lotteryMethod, object.maxNumber))
                object.id = cursor.lastrowid # 把得到的自增id赋给对象中的id属性
                # 创建每一个activity对应的几个附庸数据表
                cursor.execute("create table activity_%d_registered_people (registered_person_wxid TINYTEXT primary key)" % object.id)
                cursor.execute("create table activity_%d_selected_people (selected_person_wxid TINYTEXT primary key)" % object.id)
            elif self.datatype == DataType.user:
                cursor.execute("insert into users (wxid, user_name) values ('%s', '%s')" % (object.wxid, object.name))
            else:
                cursor.execute("insert into messages (message_type, message_title, message_content, message_sender_wxid, message_receiver_wxid) "
                               "values ('%s', '%s', '%s', '%s', '%s')" % (object.type, object.title, object.content, object.sender.wxid, object.receiver.wxid))
                object.id = cursor.lastrowid

            conn.commit()
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.close()