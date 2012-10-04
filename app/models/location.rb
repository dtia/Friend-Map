class Location < ActiveRecord::Base
  attr_accessible :address, :latitude, :longitude
  geocoded_by :address
  after_validation :geocode
  
    def self.location_stored(address)
      result = false
      if !address.eql?("undefined")
        stored = Location.where("address = ?", address).first

        if !stored.nil?
          latitude = stored.latitude
          longitude = stored.longitude      
          result = !(latitude.nil? || longitude.nil?)

          # contains nil value for latitude or longitude
          if !result
            delete_location_coordinates(address)
          end
        end        
      end
            
      return result
    end

    def self.add_location_coordinates(address)
      add_location_coordinates_with_reps(address, 5)
    end
    
    def self.add_location_coordinates_with_reps(address, num)
      if !address.eql?("undefined") && !location_stored(address) && num >= 0
        location = add_location_coordinates_helper(address)
        
        if location.latitude.nil? || location.longitude.nil?
          delete_location_coordinates(address)
          add_location_coordinates_with_reps(address, num-1)
        end
      end
    end
    
    def self.add_location_coordinates_helper(address)
      if !address.eql?("undefined")
        location = Location.new
        location.address = address
        location.save
        return location
      end
    end
    
    def self.delete_location_coordinates(address)
      Location.delete_all(["address = ?", address])
    end

    def self.get_location_coordinates(address)
      location = Location.where("address = ?", address).first
      if location.nil?
        add_location_coordinates(address)
      else
        return {:address => address, :latitude => location.latitude, :longitude => location.longitude}        
      end
    end
end
