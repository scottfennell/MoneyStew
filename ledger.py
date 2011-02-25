import sys
sys.path.append( "models/" )

from app import AppController
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from datetime import date, time, datetime
import json
from ledger_model import Ledger

class JsonStore(webapp.RequestHandler):
    
    timeFormats = ("%Y-%m-%dT%H:%M:%S", "%m/%d/%Y", "%m-%d-%Y")
    
    def parseDate(self, dateString):
        dateObj = None
        for format in self.timeFormats:
            
            try:
                dateObj = date.strptime( dateString , format )
                break
            except:
                continue

        return dateObj
    
    def get(self,args=""):
        user = users.get_current_user()

        if user:
            self.writeAll(user)
        else:
            self.redirect(users.create_login_url(self.request.uri))
    
    def writeAll(self, user):
        ''' Get all teh ledger Items '''
        lquery = Ledger.gql("WHERE user = :1", user)
        if lquery.count()>500:
            self.trace()
        
        ledgerItems = lquery.fetch(500);
        self.response.headers['Content-Type'] = 'application/json'
        
        jsonData = {
            "success" : True,
            "data" : ledgerItems
        }
        self.response.out.write(json.encode(jsonData))
    
    def post(self, args=""):
        user = users.get_current_user()

        if user:
            #self.writeAll(user)
            data = json.decode(self.request.body)
            new_ledger = data['data']
            item = Ledger(
                user=user,
                name=new_ledger['name'],
                start_date = self.parseDate(new_ledger.get("start_date","01/01/2000")),
                repeat = new_ledger['repeat'],
                repeat_amount = int(new_ledger['repeat_amount']),
                amount = float(new_ledger.get('amount', 0.0)),
                type = new_ledger.get('type', "")
            )
            item.put()
            #item.key = item.key().id()
            jsonOut = {
                "success" : True,
                "data" : [item]
            }
            self.response.out.write(json.encode(jsonOut))
                
        else:
            self.redirect(users.create_login_url(self.request.uri))
            
    def put(self, id):
        user = users.get_current_user()
        if user:
            ledgerItem = Ledger.get_by_id(int(id))
            if ledgerItem and ledgerItem.user == user:
                data = json.decode(self.request.body)
                #{"data":{"id":14,"name":"monthtest","start_date.isoformat":"2003-01-02T00:00:00","repeat":"Monthly","repeat_amount":"1","amount":"22"}}
                jsonData = data['data'];
                ledgerItem.name = jsonData.get('name',ledgerItem.name)
                ledgerItem.start_date = self.parseDate(jsonData.get('start_date.isoformat', '01/01/2000')) 
                ledgerItem.repeat = jsonData.get('repeat',ledgerItem.repeat)
                ledgerItem.repeat_amount = int( jsonData.get('repeat_amount', ledgerItem.repeat_amount) )
                ledgerItem.amount = float( jsonData.get('amount',ledgerItem.amount))
                ledgerItem.type = jsonData.get('type', "")
                
                ledgerItem.put()
                
                jsonOut = {"success":True, "message":"Saved item "+id}
                self.response.out.write(json.encode(jsonOut))
            else:
                jsonOut = {"success":False, "message":"Wrong account"}
                self.response.out.write(json.encode(jsonOut))
        else:
            self.redirect(users.create_login_url(self.request.uri))
        

    def delete(self, id):
        user = users.get_current_user()
        
        if user:
            jsonOut = {
               "success":True,
               "message":"Deleted "+id
            }
            
            ledgerItemQuery = Ledger.gql("WHERE user = :1 AND __key__ = :2", user, db.Key.from_path('Ledger',int(id)))
            ledgerItem = ledgerItemQuery.fetch(1)
            if ledgerItem and len(ledgerItem)>0:
                ledgerItem[0].delete()
                self.response.out.write(json.encode(jsonOut))
            else:
                jsonOut['success'] = False
                jsonOut['message'] = "Unable to find the ledger item to delete"
                self.response.out.write(json.encode(jsonOut))
        else:
            self.redirect(users.create_login_url(self.request.uri))


application = webapp.WSGIApplication([
                                      ('/ledger/json', JsonStore),
                                      (r'/ledger/json/(.*)', JsonStore)
                                      ], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
