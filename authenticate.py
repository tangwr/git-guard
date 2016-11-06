from Boto3Wrapper import Boto3Wrapper
from passlib.hash import pbkdf2_sha256
 

"""
Required:
pip install passlib
"""

class HashCreator:

    def CreateHash(self,password):
        return pbkdf2_sha256.encrypt(password, rounds=200000, salt_size=16)

    def Verify(self, password, hash):
        return pbkdf2_sha256.verify(password, hash)

class Auth:

    def __init__(self, Boto3Wrapper):
        self.__b3 = Boto3Wrapper
        self.__ext = ".pass"
        
    def CheckUserExists(self, userName):
        print "Checkfing for file> " + userName + self.__ext
        return self.__b3.CheckFileExists(userName + self.__ext);

    def Register(self, userName, password):
        if self.CheckUserExists(userName) == True:
            return False

        # If user Dont exists...Register him#
        hashCreator = HashCreator()
        hash = hashCreator.CreateHash(userName+password)
        self.__b3.UploadFile(userName + self.__ext, hash)
        return True

    
    def Authenticate(self, userName, password):
        if self.CheckUserExists(userName) == False:
            print "File dont exists"
            return False

        hash = self.__b3.ReadFileContents(userName + self.__ext)
        print "Contents " + hash
        hashCreator = HashCreator()
        if hashCreator.Verify(userName+password, hash) == True:
            print "Verification Success!"
            return True
        else:
            print "Verification failed!"
            return False
"""
b = Boto3Wrapper('subs3219')
auth = Auth(b)
username = "cs3219group2@gmail.com"
password = "!@#QWEasd"
if auth.CheckUserExists(username) == False:
    auth.Register(username, password)
    print "Registration Success!"
else :
    print "User exists!"
"""

"""
#How To Use to Register

b = Boto3Wrapper('subs3219')
auth = Auth(b)

if auth.CheckUserExists("newuser") == False:
    auth.Register("newuser", "password")
    print "Registration Success!"
else :
    print "User exists!"
"""

"""
#How To User to Login

b = Boto3Wrapper('subs3219')
auth = Auth(b)

if auth.Authenticate("newuser123", "password") == True:
    print "Welcome to GitGuard"
else:
    print "Auth failed"


"""
