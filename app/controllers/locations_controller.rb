class LocationsController < ApplicationController
  def index
  end
  
  def create
      coords_for_map = []
      locations_json = params[:locations]      
      @locations = ActiveSupport::JSON.decode(locations_json)
      @locations.each do |location|
        if !Location.location_stored(location)
          Location.add_location_coordinates(location)
        end
        
        if !location.eql?("undefined")
          coords = Location.get_location_coordinates(location)
          if !coords.nil? 
            coords_for_map.push(coords)
          end
        end
      end
      
      respond_to do |format|
        format.json { render json: coords_for_map }
      end
  end
  
end
