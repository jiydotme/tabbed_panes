module TabbedPanes
	class Panes
		class PanesBuilder < Builder
			def pane_for(id, title, url, options = {})     
			 	raise NotImplementedError 
			end                                       
			
			def pane_selected?(id)
				@context.current_tab?(id)
			end  
			
		end			
	
	 	class DefaultPanesBuilder < PanesBuilder
      def begin_panes        
				"<ul id='#{unique_object_id}_panes' class='panes'>"
			end           

			def end_panes
				"</ul>"
			end

			def pane_for(id, options = {}, &block)     
				content = @context.capture(&block) if pane_selected?(id) || options[:force]
				@context.concat(@context.content_tag(:li, content, :id => "#{unique_object_id}_#{id}_pane", :class => [pane_selected?(id) ? 'pane selected' : 'pane', options[:class]].join(' ')))
			end  

		end

		def initialize(object, context, options = {})
			@object = object
			@context = context
			@builder = (options.delete(:builder) || DefaultPanesBuilder).new(@object, @context, options)
		end           

		%w(begin_panes end_panes).each do |method|
			define_method(method) do 
				@builder.send(method)
			end
		end

		def method_missing(method_name, *args, &block)
			@builder.pane_for(method_name, *args, &block)
		end
 
 	end          
end
