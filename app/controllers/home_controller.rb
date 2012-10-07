class HomeController < ApplicationController
  def index
    Settings.reload!
    if Rails.env.development?
      Location.set_ip(Settings.request_ip)
    else
      Location.set_ip(request.ip)
    end
  end
end
