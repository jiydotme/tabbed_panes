module TabbedPanes
	class Builder  
		def initialize(object, context, options = {})   
			@object = object
			@context = context
			@options = options
		end
		  
		private
			def unique_object_id  
				case @object.class.to_s
				when 'Symbol': "#{@object}"
				when 'String': "#{@object}"
				else "#{@context.dom_id(@object)}"
				end
			end
			
	end
end
