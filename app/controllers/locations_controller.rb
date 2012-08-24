class LocationsController < ApplicationController
  def index
    
  end
  
  def create
      locations_json = params[:locations]
      @locations = ActiveSupport::JSON.decode(locations_json)
      @locations.each do |location|
        city = location["city"]
        
        if !Location.location_stored(city)
          puts 'new location: ' + city 
          coords = Location.get_geocode(city)
          lat = coords["lat"]
          lng = coords["lng"]
          Location.add_location_coordinates(city, lat, lng)
        end
      end    
  end
end
