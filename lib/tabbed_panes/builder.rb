module TabbedPanes
	class Builder  
		def initialize(context, options = {})   
			@context = context
			@options = options.reverse_merge!({ :namespace => :jiy })  
		end
		  
		private
			def mangle(*attr)
				 "#{@options[:namespace]}_" + attr.join('_')
			end
			
	end
end
