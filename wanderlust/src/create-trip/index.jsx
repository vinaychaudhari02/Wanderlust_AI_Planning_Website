import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { Input } from '@/components/ui/input';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.712776, lng: -74.005974 }); // Default to New York City

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Map styles and options
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <>
      <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
        <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
        <p className='mt-3 text-gray-500 text-xl'>
          Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
        </p>

        <div className='mt-20 flex flex-col gap-10'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange('location', v);

                  // Update map center when place is selected
                  if (v?.value?.geometry?.location) {
                    const { lat, lng } = v.value.geometry.location;
                    setMapCenter({ lat: lat(), lng: lng() });
                  }
                },
              }}
            />
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
            <Input
              placeholder={'Ex.3'}
              type='number'
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>

          {/* Google Map */}
          <div className='my-10'>
            <h2 className='text-xl my-3 font-medium'>Map Preview of Your Destination</h2>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10}
              >
                {/* Optional Marker at selected place */}
                {mapCenter && <Marker position={mapCenter} />}
              </GoogleMap>
            </LoadScript>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-4 border cursor-pointer 
            rounded-lg hover:shadow-lg
            ${formData?.budget == item.title && 'shadow-lg border-black'}`}
                >
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
              ${formData?.traveler == item.people && 'shadow-lg border-black'}`}
                >
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <div className='my-10 justify-end flex'>
        <Button>Generate Trip</Button>
      </div>
    </>
  );
}

export default CreateTrip;
