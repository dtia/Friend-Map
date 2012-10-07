class HomeController < ApplicationController
  def index
    Settings.reload!
    Location.set_ip(Settings.request_ip)
  end
end
