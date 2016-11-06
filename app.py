from flask import Flask, render_template, json, request, redirect, session, url_for
from flaskext.mysql import MySQL
from datetime import datetime, timedelta
from authenticate import Auth
from Boto3Wrapper import Boto3Wrapper
from Notification import Notifier


app = Flask(__name__)
app.secret_key = 'why would I tell you my secret key?'

def getSession():
	try:
		session['user'] = session.get('user')			
	except KeyError:
		session['user'] = None
	finally:
		if session.get('user') is None:
			button = ["Login", "Register"]
		else:
			button = ["Notification", "Logout"]

		return button


@app.route('/')
@app.route('/home')
def main():
	pig = request.args.get('msg')
	if pig != None:
		pig = "Welcome " + pig

	button = getSession()
	
	return render_template("index.html", button=button)


@app.route('/login', methods=['POST', 'GET'])
def login():
	#request.form['']

	username = request.form['login_email']
	password = request.form['login_password']

	b = Boto3Wrapper('subs3219')
	auth = Auth(b)

	if auth.Authenticate(username, password) == True:
	    msg = "Welcome to GitGuard"
	    ses = username
	else:
	    msg = "Auth failed"
	    ses = None


	session['user'] = ses
	#return redirect(url_for('main',msg=msg))
	return redirect("/")

	#return redirect(url_for('home', msg="df"))


@app.route('/register', methods=['POST', 'GET'])
def register():
	username = request.form['register_email']
	password = request.form['register_password']

	b = Boto3Wrapper('subs3219')
	auth = Auth(b)
	#username = "cs3219group2@gmail.com"
	#password = "!@#QWEasd"
	if auth.CheckUserExists(username) == False:
	    auth.Register(username, password)
	    msg = "Registration Success!"
	else :
	    msg = "User exists!"

	#return redirect(url_for('main',msg=msg))
	return redirect("/")

@app.route('/notification', methods=['POST', 'GET'])
def notification():
	username = session["user"]
	repo = request.form['notifyRepo']
	email = request.form['notifyEmail']

	

	emailArr = email.split("\r\n")  
	
	b = Boto3Wrapper('subs3219')
	n = Notifier(b)


	n.CreateNotifier(username, emailArr, repo)
	
		

	#return redirect(url_for('main',msg=username))
	return redirect("/")
"""
@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
	print jsdata
	return jsdata

@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    jsdata = request.form['javascript_data']
    print jsdata
    return jsdata
"""

@app.route('/search', methods = ['POST'])
def search():

	
	username = session["user"]
	repo = request.form['javascript_data'] #.split("https://")[1]
	
	print repo 
	print username
	
	b = Boto3Wrapper('subs3219')
	n = Notifier(b)


	n.UpdateTime(username, repo)
	
	#return json.dumps({'message':'User created successfully !'})
	
	return repo



@app.route('/logout', methods=['POST', 'GET'])
def logout():
	session.pop('user',None)
	return redirect("/")


if __name__ == "__main__":
	app.run()