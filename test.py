import sys
sys.path.append( "models/" )
import cgi
import os
import datetime
import pprint
import json
from datetime import date, time
from google.appengine.ext.webapp import template
from app import AppController
from ledger_model import Ledger

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db


#Root page handler
"""
Root Page Handerlerere
"""
class MainPage(AppController):
    def __init__(self):
      self.name = "MainPage"
      
    def get(self):
        ledger_query = Ledger.all()
        ledger = ledger_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        for l in ledger:
#            self.response.out.write(l.key)
#            self.response.out.write(l.start_date)
            
#            self.pprint(json.GqlEncoder().default(l))
            try: 
                self.pprint(json.encode(l))
            except TypeError:
                 continue
            
#            self.pprint(dir(l));
        
        template_values = {
            'ledgers': ledger,
            'url': url,
            'url_linktext': url_linktext,
        }

        path = os.path.join(os.path.dirname(__file__), 'test.html')
        self.response.out.write(template.render(path,template_values))
    
    def pprint(self, data):
        self.response.out.write("<pre>");
        pp = pprint.PrettyPrinter(indent=4,stream=self.response.out)
        pp.pprint( data )
        self.response.out.write("</pre>");


class Create(webapp.RequestHandler):
    def post(self):
        self.response.out.write("posting stuff")
        dt = self.request.get('start_date').split("/")
        self.response.out.write(dt)
        setdate = datetime.date(year=int(dt[2]), month=int(dt[0]), day=int(dt[1])),
        setdatea = date(2007,1,2)
        self.response.out.write(setdate)
        item = Ledger(
            user=users.get_current_user(),
            name=self.request.get('name'),
            start_date = setdatea,
            repeat = self.request.get('repeat'),
            repeat_amount = int(self.request.get('repeat_amount')),
        )
        self.response.out.write("name"+item.name)
        
        item.put()
        
        #self.redirect('/test/')

application = webapp.WSGIApplication(
                                     [('/test/', MainPage),
                                      ('/test/post', Create)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()