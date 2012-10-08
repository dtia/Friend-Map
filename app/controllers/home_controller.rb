class HomeController < ApplicationController
  def index
    Settings.reload!
    
    Location.set_ip(request.ip)
    if Rails.env.development?
      Location.set_ip('24.193.83.1')
    else
      Location.set_ip(request.ip)
    end
  end
end
