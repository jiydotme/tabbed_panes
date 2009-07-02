module TabbedPanes 
	module PanesHelper
		def panes_for(object, options = {}, &block)  
			panes = Panes.new(object, self, options)
			concat(panes.begin_panes) 
			yield panes                 
			concat(panes.end_panes)
		end

	end           
end
