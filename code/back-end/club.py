import mysql.connector


class Club():
    def __init__():
        pass


    def createClub(club_id,club_name,club_description='',club_president_user_id=0):
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()


        try:
            cursor.execute("insert into clubs (club_id,club_name,club_description,club_president_user_id) values (%d,'%s','%s',%d)"%(club_id,club_name,club_description,club_president_user_id))
        except mysql.connector.errors.IntegrityError:  #Duplicate entry for key 'PRIMARY'
            return 1
        
        try:
            cursor.execute("create table club_%d_activities (activity_id INT primary key)"%(club_id))
        except mysql.connector.errors.ProgrammingError: #table already exist
            pass

        try:
            cursor.execute("create table club_%d_members (member_user_id INT primary key)"%(club_id))
        except mysql.connector.errors.ProgrammingError:
            pass

        try:
            cursor.execute("create table club_%d_managers (manager_user_id INT primary key)"%(club_id))
        except mysql.connector.errors.ProgrammingError:
            pass

        cursor.close()
        conn.commit()
        conn.close()
        return 0

    def updateClubInfo(new_id,new_name,new_prisident='',new_description='',new_ico='',new_picture=''):
        pass
       

    def deleteClub(club_id):
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()
        try:
            cursor.execute('delete from clubs where club_id=%d'%(club_id))
        except mysql.connector.errors.ProgrammingError:
            return 1

        try:
            cursor.execute("delete table club_%d_activities"%(club_id))
        except mysql.connector.errors.ProgrammingError: 
            return 2

        try:
            cursor.execute("delete table club_%d_members"%(club_id))
        except mysql.connector.errors.ProgrammingError: 
            return 3

        try:
            cursor.execute("delete table club_%d_managers"%(club_id))
        except mysql.connector.errors.ProgrammingError: 
            return 4


        cursor.close()
        conn.commit()
        conn.close()
        return 0



    def getClubInfo(club_id): #return a list of tuples
        conn = mysql.connector.connect(user='root', password='root', database='test_gp10')
        cursor = conn.cursor()

        try:
            cursor.execute("select * from clubs where club_id=%d"%(club_id))
        except mysql.connector.errors.ProgrammingError:       
            pass

        res = cursor.fetchall()
        cursor.close()
        conn.close()
        return res



    



if __name__=='__main__':
    pass
        

