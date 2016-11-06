from Boto3Wrapper import Boto3Wrapper
import json
from datetime import datetime

class Notifier:

    def __init__(self, Boto3Wrapper):
        self.__b3 = Boto3Wrapper
        self.__ext = ".notify"
        
    def __ConcatEmails(self,emailList):
        emails = ""
        for email in emailList:
            emails += email + ","
        emails = emails[:-1] #remove trailing ,
        return emails

    def CreateJsonObjectFromArray(self, array):
        jsondata = json.dumps(array)
        return jsondata

    def GetArrayFromJsonObject(self, jsondata):
        return json.loads(jsondata)
   
    def CreateDictionary(self, repo, emails, lastvisit):

        dictionary = {}
        dictionary["Repo"] = repo
        dictionary["Emails"] = emails
        dictionary["LastVisit"] = lastvisit
        return dictionary

    def GetArrayElement(self, array, repo):
        for element in array:
            if element["Repo"] == repo:
                return element
        return "null"

    def RemoveArrayElement(self, array, repo):
        for element in array:
            if element["Repo"] == repo:
                array.remove(element)
                break
        return array


    def AddArrayElement(self, array, dictionary):
        array.append(dictionary)
        return array
                
    def CreateNotifier(self, username, emails, repo):
        
        # Check if there exists a notifier for user #
        if self.__b3.CheckFileExists(username + self.__ext) == False:

            #Create new notifier #
            stringEmails = self.__ConcatEmails(emails)
            dictionary = self.CreateDictionary(repo, stringEmails, self.GetCurrentDateTime())
            array = self.AddArrayElement([], dictionary)
            jsondata = self.CreateJsonObjectFromArray(array)
            self.__b3.UploadFile(username + self.__ext, jsondata)

        # There already exists a notifier, update it#
        else:

            jsondata = self.__b3.ReadFileContents(username + self.__ext)
            array = self.GetArrayFromJsonObject(jsondata)
            dictionary = self.GetArrayElement(array, repo)

            if dictionary == "null":
                stringEmails = self.__ConcatEmails(emails)
                dictionary = self.CreateDictionary(repo, stringEmails, self.GetCurrentDateTime())
                array = self.AddArrayElement(array, dictionary)
                jsondata = self.CreateJsonObjectFromArray(array)
                self.__b3.UploadFile(username + self.__ext, jsondata)
            else :
                currentEmails = dictionary["Emails"].split(",")
                s = set()
                for email in currentEmails:
                    s.add(email)
                for email in emails:
                    s.add(email)

                s = list(s)
                stringEmails = self.__ConcatEmails(s)
                newDictionary = self.CreateDictionary(dictionary["Repo"], stringEmails,dictionary["LastVisit"])
                array = self.RemoveArrayElement(array, dictionary["Repo"])
                array = self.AddArrayElement(array, newDictionary)
                jsondata = self.CreateJsonObjectFromArray(array)
                self.__b3.UploadFile(username + self.__ext, jsondata)
                
    def UpdateTime(self, username, repo):
        if self.__b3.CheckFileExists(username + self.__ext) == False:
            return
        jsondata = self.__b3.ReadFileContents(username + self.__ext)
        array = self.GetArrayFromJsonObject(jsondata)

        newDictionary = {}
        for dictionary in array:
            if dictionary["Repo"] == repo :
                newDictionary = self.CreateDictionary(dictionary["Repo"], dictionary["Emails"], self.GetCurrentDateTime())
                break
        array = self.RemoveArrayElement(array, newDictionary["Repo"])
        array = self.AddArrayElement(array, newDictionary)
        
        jsondata = self.CreateJsonObjectFromArray(array)
        self.__b3.UploadFile(username + self.__ext, jsondata)
                
    def GetEmailsForRepo(self, username, repo):
       
        fileName = username + self.__ext
        if self.__b3.CheckFileExists(fileName) == False:
            return []
        else :
           jsondata = self.__b3.ReadFileContents(fileName)
           array = self.GetArrayFromJsonObject(jsondata)
           dictionary = self.GetArrayElement(repo)
           emails = dictionary["Emails"]
           return emails.split(",")
            
    def GetTimeDifference(self, d1,d2):
        fmt = "%d-%b-%Y %H:%M:%S"
        dd1 = datetime.strptime(d1,fmt)
        dd2 = datetime.strptime(d2,fmt)
        td = dd2-dd1
        
        hours, remainder = divmod(td.total_seconds(), 3600)
        minutes, seconds = divmod(remainder, 60)
        hours, minutes, seconds = int(hours), int(minutes), int(seconds)
        if hours < 10:
            hours = '0%s' % int(hours)
        if minutes < 10:
            minutes = '0%s' % minutes
        if seconds < 10:
            seconds = '0%s' % seconds
        return '%s hrs %s mins  %s secs' % (hours, minutes, seconds)
                
    def GetCurrentDateTime(self):
        fmt = "%d-%b-%Y %H:%M:%S"
        return datetime.now().strftime(fmt)

    def GetLatestVisit(self, username, repo):
        fileName = username + self.__ext
        if self.__b3.CheckFileExists(fileName) == False:
            return ""
        else :
            
            jsondata = self.__b3.ReadFileContents(fileName)
            array = self.GetArrayFromJsonObject(jsondata)
            dictionary = self.GetArrayElement(repo)
            return dictionary["LastVisit"]
        
    def GetDateDifference(self, username, repo):
        fileName = username + self.__ext
        if self.__b3.CheckFileExists(fileName) == False:
            return "null"
        else :
            jsondata = self.__b3.ReadFileContents(fileName)
            array = self.GetArrayFromJsonObject(jsondata)
            dictionary = self.GetArrayElement(array, repo)
            latestvisit = dictionary["LastVisit"]
            now = self.GetCurrentDateTime()
            diff = self.GetTimeDifference(latestvisit, now)
            return diff

            
        
b = Boto3Wrapper('subs3219')
n = Notifier(b)


#n.UpdateTime("seewhatseeabc@gmail.com", "yourrepo.github.com")

n.CreateNotifier("seewhatseeabc@gmail.com", ["wanting5315@gmail.com", "wireless-@hotmail.com", "seewhatseeabc@gmail.com"], "yourrepo.github.com")

print "done"

#n.UpdateTime("wireless-@hotmail.com", "myrepo.github.com");
#print n.GetLatestVisit("wireless-@hotmail.com", "myrepo.github.com")
#print n.GetDateDifference("wireless-@hotmail.com", "myrepo.github.com")
