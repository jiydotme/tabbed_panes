require "fileutils"
include FileUtils::Verbose
 
RAILS_ROOT = File.expand_path(File.join(File.dirname(__FILE__), "..", "..", "..")) unless defined?(RAILS_ROOT)
cp  File.join(File.dirname(__FILE__), "assets", "javascripts", "tabbed_panes.js"), 
		File.join(RAILS_ROOT, "public", "javascripts")
cp  File.join(File.dirname(__FILE__), "assets", "stylesheets", "tabbed_panes.css"), 
		File.join(RAILS_ROOT, "public", "stylesheets")    