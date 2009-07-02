module TabbedPanes
	module TabsHelper
		def tabs_for(options = {}, &block)  
			raise BlockMissing, "No block given" unless block_given?
			tabs = Tabs.new(self, options)
			concat(tabs.begin_tabs)            
			yield tabs                 
			concat(tabs.end_tabs)
		end

	end          
end
