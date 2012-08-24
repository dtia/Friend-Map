require 'net/http'

class Location < ActiveRecord::Base
  attr_accessible :city, :lat, :lng
  
  def self.location_stored(city)
    stored = Location.where("city = ?", city)
    return stored.length > 0
  end
  
  def self.add_location_coordinates(city, lat, lng)
    location = Location.new
    location.city = city
    location.lat = lat
    location.lng = lng
    location.save
  end
  
  def self.get_geocode(city)
    url = URI.parse('http://maps.googleapis.com/maps/api/geocode/json')
    http_url = url.path + '?address=%s&sensor=true' % format_query(city)
    req = Net::HTTP::Get.new(http_url)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    json_string = res.body
    location_data = ActiveSupport::JSON.decode(json_string)
    results = location_data["results"].first
    geometry = results["geometry"]
    coords = geometry["location"]
    return coords    
  end
  
  private
    def self.format_query(query)
      formatted_query = CGI.escape(query)
      formatted_query = formatted_query.gsub(' ', '+')
      return formatted_query
    end
end
