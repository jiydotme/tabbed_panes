module TabbedPanes
	module Controller
		def self.included(base)
			base.extend ClassMethods
			base.class_eval do
				include InstanceMethods     
				helper TabsHelper, PanesHelper   
				helper_method :current_tab?
			end
		end                       
		
		module ClassMethods
			def tabbed_pane(*args)
				options = args.extract_options!
				name = args[0]
				before_filter(options) do |controller|
					controller.instance_eval { set_tab_name(name.to_sym) }
				end
			end
		end
		          
		module InstanceMethods
			protected
				def set_tab_name(name)                               
					@tab_name = name
				end  
				
				def current_tab?(name)
					return @tab_name == name.to_sym
				end
		end
		
	end
end
