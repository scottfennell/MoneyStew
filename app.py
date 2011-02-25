'''
Created on Feb 13, 2011

@author: stillboy
'''
import cgi
import os
import pprint
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db

"""
Handle application wide settings, such as layout and 
"""
class AppController(webapp.RequestHandler):
    
    def renderTemplate(self, template_name, values):
        
        path = os.path.join(os.path.dirname(__file__), "templates", template_name)
        if(os.path.isfile(path)):
            return template.render(path,values)
        else:
            return "template "+template_name+" not found."
            
    '''
    Get scripts from the js lib dir to automatically add to the base
    html     
    '''
    def _getscripts(self):
        scripts = [
            "/js/ext/adapter/ext/ext-base-debug.js",
            "/js/ext/ext-all-debug.js",
            "/js/ext/ux/Ext.ux.data.CouchReader.js",
            "/js/ext/examples/ux/CheckColumn.js",
            "/js/ext/examples/ux/GroupSummary.js"
        ]
        path = os.path.join(os.path.dirname(__file__), "js/lib")
        #Path to js_files symlink ... this might be easier to just manually manage
        files = os.listdir("js_libs")
        
        for file in files:
            scripts.append("/js/lib/"+file)
            
        return scripts
    
    def render(self, content_for_layout, layout='base.html'):
        #get layout information and set that too the viewadsaf
        template_values = {
            'content_for_layout':content_for_layout,
            'scripts_for_layout':self._getscripts()
        }
        self.response.out.write(self.renderTemplate(layout,template_values))
        
    def debug(self):
        self.prewrite(vars(self.request))
        
    def write(self, out):
        self.response.out.write("<div>");
        self.response.out.write(out)
        self.response.out.write("</div>");

    def prewrite(self, out):
        self.response.out.write("<pre>");
        pp = pprint.PrettyPrinter(indent=4,stream=self.response.out)
        pp.pprint( out )
        self.response.out.write("</pre>");