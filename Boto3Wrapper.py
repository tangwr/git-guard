"""
Required:
pip install boto3
"""

"""
Things to do:
1) Open AWS S3
2) Right click your bucket > Go to Properties
3) Go to Permissions
5) Click on Edit Bucket Policy
6) Paste the following (REPLACE subs3219 WITH YOUR BUCKET NAME)

{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": "*",
			"Action": [
				"s3:ListBucket",
				"s3:GetBucketLocation"
			],
			"Resource": "arn:aws:s3:::subs3219"
		},
		{
			"Effect": "Allow",
			"Principal": "*",
			"Action": [
				"s3:PutObject",
				"s3:PutObjectAcl",
				"s3:GetObject",
				"s3:GetObjectAcl",
				"s3:DeleteObject"
			],
			"Resource": "arn:aws:s3:::subs3219/*"
		}
	]
}

"""
import boto3

class Boto3Wrapper:

    def __init__(self, bucketName):
        self.__s3 = boto3.resource('s3')
        self.__ConnectToBucket(bucketName)

    def __ConnectToBucket(self, bucketName):
        self.__bucketName = bucketName
        self.__bucket = self.__s3.Bucket(bucketName)

    def CheckFileExists(self, fileName):
        for obj in self.__bucket.objects.all():
            if obj.key == fileName:
                return True
            else:
                pass
                    #print obj.key

        return False

    def GetAllFilePaths(self):
        filePaths = []
        for obj in self.__bucket.objects.all():
            filePaths.append(obj.key)
        return filePaths

    def GetCurrentBucketName(self):
        return self.__bucketName

    def ReadFileContents(self, filePath):
        s3Obj = self.__bucket.Object(filePath);
        return s3Obj.get()["Body"].read()

    def GetLastModifiedTimestamp(self, filePath):
        s3Obj = self.__bucket.Object(filePath);
        return s3Obj.last_modified

    def DeleteFile(self, filePath):
        self.__bucket.delete_objects(Delete = {'Objects':[{'Key': filePath}]})

    def UploadFile(self, destFilePath, data):
        self.__bucket.put_object(Key=destFilePath, Body=data, ACL='public-read-write')

#b = Boto3Wrapper('subs3219')      
#b.DeleteFile("cs3219group2@gmail.com.pass")
"""
#HOW TO USE:

# INITIALIZE WITH  BUCKET NAME #
b = Boto3Wrapper('subs3219')

# PRINTS BUCKET NAME #
print b.GetCurrentBucketName()

# UPLOAD FILE a.txt with data "12345"
b.UploadFile("a.txt", "12345")

# Download and PRINT CONTENTS #
print b.ReadFileContents("a.txt")


print b.GetLastModifiedTimestamp("a.txt");

# Check if File exists #
print b.CheckFileExists("a.txt")

#Delete File
b.DeleteFile("a.txt")

# Check if File exists #
print b.CheckFileExists("a.txt")
"""
