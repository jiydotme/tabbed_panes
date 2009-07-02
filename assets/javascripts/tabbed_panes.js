/**
 * TabbedPanes
 *
 * Copyright 2007-2009 (c) jiy.me All rights reserved.
 */       
                                  
var Console = {}
Console.activated = true;
Console.debug = function(msg) {
	Console._log("[debug]: " + msg);
}
Console._log = function(msg) {
	if(!Console.activated) 
		return;
	try { 
		console.log(msg); 
	} catch(e) {   
		try {
			console = { log: function(msg) { alert(msg); } } 
			console.log(msg);
		} catch(e) {
			
		}
	}
}              
        
/* TabbedPane */     
var TabbedPane = Class.create({                                                                              
  isLoaded: false,
	initialize: function(parCntrl, tab, pane, options /*= {}*/) {
		this.options = {
			cachedLoading: false
		};
		Object.extend(this.options, options || {});			
		this.parCntrl = parCntrl;
		this.tab = tab;
		// check if tab selected
		this.isLoaded = this.tab.hasClassName(TabbedPanes.tabSelected);
		// init the pane
		this.pane = pane;
		// get the href
	  lnks = this.tab.select('a');
		if(lnks.length < 1) {
			Console.debug("No link found for tab with tabId='"+ tab.id +"'");
			return;
		}        
		this.lnk = lnks[0];     
		// hook on click event
    Event.observe(this.lnk, 'click', this.select.bindAsEventListener(this), false);		
	},
	select: function(event) {
		if(!this.options.cachedLoading || !this.isLoaded) {
			new Ajax.Request(this.lnk.href, {
				asynchronous: true, 
				evalScripts: true,
				method: 'get', 
				onLoading: this.onLoading.bind(this),
				onSuccess: this.onSuccess.bind(this),
				onFailure: this.onFailure.bind(this)
			});
	  } else {
			this.switchPane();
		}
		// stop propagation
		event.stop();
		return true;
	},                              
	onLoading: function(request) {
		new TabbedPane.Spinner(this.pane);  
		this.switchPane();
	},
	onSuccess: function(request) {		                                
		this.pane.update(request.responseText);  
		this.isLoaded = true;					
	},                    
	onFailure: function(request) { 
		Console.debug("Tabbed loading '"+ this.lnk.href +"' failed!");  
		this.pane.update((new FailureMessage).html);		
	},    
	switchPane: function() {             
		this.parCntrl.unselectAll(); 
		this.tab.addClassName(TabbedPanes.tabSelected);			
    this.pane.addClassName(TabbedPanes.paneSelected); 
	}                    
});                 
/* TabbedPane.Spinner */
TabbedPane.Spinner = Class.create({
	initialize: function(elem) {
		this.elem = $(elem)
		this.elem.update(new Element('div', { 'class':"spinner" }).update(new Element('img', { alt:'Wait', src:'/images/loading.gif'})));  
	}
});
/* TabbedPanes */
var TabbedPanes = Class.create({
	initialize: function(tabsContainer, panesContainer, options /*= {}*/) {
		this.options = {
		};
		Object.extend(this.options, options || {});		
		this.tabsContainer = $(tabsContainer);
		this.panesContainer = $(panesContainer);
		this.tabs = this.tabsContainer.select("li." + TabbedPanes.tabClassName);
		this.panes = this.panesContainer.select("li." + TabbedPanes.paneClassName);
		this.tabbedPanes = [];
		for(i = 0; i < this.tabs.length; ++i) {
			  tab = this.tabs[i];
			  nameRegExp = new RegExp("(.*)" + TabbedPanes.tabIdPostfix, "i");
			  nameRes = tab.id.match(nameRegExp);
			  if(!nameRes || nameRes.length < 2) {
					Console.debug("The tabId='"+ tab.id +"' is malformed. Please review the yg api." );
					continue;
				}
			  name = nameRes[1];
			  paneMatches = this.panesContainer.select('li#' + name + TabbedPanes.paneIdPostfix);
				if(!paneMatches || paneMatches.length != 1) {
					Console.debug("The tabId='"+ tab.id +"' has no correspoding pane. Please review the yg api.");
					continue;
				}
			  pane = paneMatches[0];
			  this.tabbedPanes.push(new TabbedPane(this, tab, pane, this.options));
		}  
	},
	unselectAll: function() {
		this.tabs.each(function(tab) {
			tab.removeClassName(TabbedPanes.tabSelected);
		});
		this.panes.each(function(pane) {
			pane.removeClassName(TabbedPanes.paneSelected);
		});
	}
});
TabbedPanes.cntrls = [];
TabbedPanes.tabsClassName = 'tabs';
TabbedPanes.tabClassName = 'tab';
TabbedPanes.panesClassName = 'panes';
TabbedPanes.paneClassName = 'pane';
TabbedPanes.tabsIdPostfix = '_tabs';
TabbedPanes.tabIdPostfix = '_tab';
TabbedPanes.panesIdPostfix = '_panes';
TabbedPanes.paneIdPostfix = '_pane';
TabbedPanes.tabSelected = 'selected';
TabbedPanes.paneSelected = 'selected';
TabbedPanes.setup = function() {
	tabSets = $$('ul.' + TabbedPanes.tabsClassName);
	paneSets = $$('ul.' + TabbedPanes.panesClassName);
	for(i = 0; i < tabSets.length; ++i) {
		tabs = tabSets[i];
		// get panes for tabs
	  tabsNameRegExp = new RegExp("(.*)" + TabbedPanes.tabsIdPostfix, "i");
	  tabsNameRes = tabs.id.match(tabsNameRegExp);
	  if(!tabsNameRes || tabsNameRes.length < 2) {
			Console.debug("The tabsId='"+ tabs.id +"' is not well formed. Please review the yg apis.");
			continue;
		}
	  tabsName = tabsNameRes[1];
	  // find the corresponding panes
	  panesMatched = false;
	  panesNameRegExp = new RegExp(tabsName + TabbedPanes.panesIdPostfix, "i");
		for(j = 0; !panesMatched && j < paneSets.length; ++j) {
			panes = paneSets[j];
			panesMatched = (-1 != panes.id.search(panesNameRegExp));
			if(panesMatched) 
				TabbedPanes.cntrls.push(new TabbedPanes(tabs, panes));
		}
		// report unmatching
		if(!panesMatched) {
			Console.debug("For tabsId='"+ tabs.id +"' and tabsName='"+ tabsName +"' no panes matched. Please review the yg apis.");
		}
	}
};                                                   
Event.observe(document, 'dom:loaded', TabbedPanes.setup);

 
