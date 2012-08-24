class LocationsController < ApplicationController
  def index
    
  end
  
  def create
      coords_for_map = []
      locations_json = params[:locations]
      @locations = ActiveSupport::JSON.decode(locations_json)
      @locations.each do |location|
        city = location["city"]
        
        if !Location.location_stored(city)
          coords = Location.get_geocode(city)
          lat = coords["lat"]
          lng = coords["lng"]
          Location.add_location_coordinates(city, lat, lng)          
        end
        
        coords_for_map.push(Location.get_location_coordinates(city))
      end
      
      render :json => coords_for_map
  end
end
