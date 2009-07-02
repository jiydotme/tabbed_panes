require File.join(File.dirname(__FILE__), "lib", "tabbed_panes")    
ActionController::Base.send :include, TabbedPanes::Controller
ActionView::Base.send :include, TabbedPanes::TabsHelper	     
ActionView::Base.send :include, TabbedPanes::PanesHelper	     

RAILS_DEFAULT_LOGGER.info("* TabbedPanes: initialized properly")