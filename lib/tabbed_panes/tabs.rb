module TabbedPanes
	class Tabs
		class TabsBuilder < Builder
			def tab_for(id, title, url, options = {})     
			 	raise NotImplementedError 
			end
			
			def sanitize_url(url) 
				url.sub(/(http|https):\/\/.*\//, '/')
			end
			
			def tab_selected?(id)
				@context.current_tab?(id)
			end
					
		end 
	
		class DefaultTabsBuilder < TabsBuilder
      def begin_tabs        
				"<ul id='#{mangle('tabs')}' class='tabs'>"
			end           
		
			def end_tabs
				"</ul>"
			end
					
			def tab_for(id, title, url, options = {})   
				@context.content_tag(:li, :id => "#{mangle(id, 'tab')}", :class => tab_selected?(id) ? 'tab selected' : 'tab') do  
					@context.link_to(title, url, options) 
			 end
			end
		end
			
		def initialize(context, options)   
			@context = context 
			@builder = (options.delete(:builder) || DefaultTabsBuilder).new(@context, options)
		end           
	  
		%w(begin_tabs end_tabs).each do |method|
			define_method(method) do 
				@builder.send(method)
			end
		end
	
		def method_missing(method_name, *args)
			@builder.tab_for(method_name, *args)
		end
	
	end                
end  
