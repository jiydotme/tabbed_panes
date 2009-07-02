module TabbedPanes 
	module PanesHelper
		def panes_for(options = {}, &block)       
			panes = Panes.new(self, options)
			concat(panes.begin_panes) 
			yield panes                 
			concat(panes.end_panes)
		end

	end           
end
