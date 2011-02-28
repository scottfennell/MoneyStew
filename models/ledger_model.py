import cgi
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db

class Ledger(db.Model):
    user = db.UserProperty()
    name = db.StringProperty()
    start_date = db.DateProperty()
    repeat = db.StringProperty(required=True, choices=set(["Monthly", "Daily", "Yearly", "Weekly", "None"]))
    repeat_amount = db.IntegerProperty()
    amount = db.FloatProperty()
    type = db.StringProperty()
    note = db.StringProperty(multiline=True)
