class LocationsController < ApplicationController
  def index
  end
  
  def create
      coords_for_map = []
      locations_json = params[:locations]      
      @locations = ActiveSupport::JSON.decode(locations_json)
      @locations.each do |location|
        if !Location.location_stored(location)
          coords = Location.add_location_coordinates(location)
        end
        
        coords_for_map.push(Location.get_location_coordinates(location))
      end
      
      respond_to do |format|
        format.json { render json: coords_for_map }
      end      
  end
  
end
