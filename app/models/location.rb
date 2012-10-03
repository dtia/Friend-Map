class Location < ActiveRecord::Base
  attr_accessible :address, :latitude, :longitude
  geocoded_by :address
  after_validation :geocode
  
    def self.location_stored(address)
      stored = Location.where("address = ?", address)
      return stored.length > 0
    end

    def self.add_location_coordinates(address)
      location = Location.new
      location.address = address
      location.save
    end

    def self.get_location_coordinates(address)
      locations = Location.where("address = ?", address)
      location = locations[0]
      return {:address => address, :latitude => location.latitude, :longitude => location.longitude}
    end
end
