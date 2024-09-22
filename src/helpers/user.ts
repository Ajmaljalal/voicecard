import { UserCredential } from 'firebase/auth';
import { AppUser } from '../types/User';


export const serializeAppUser = (
  {
    credential,
    userDoc
  }: {
    credential: UserCredential,
    userDoc: any
  }): AppUser => {
  return {
    authId: credential.user.uid,
    email: credential.user.email,
    ...userDoc
  };
}

export const reverseGeocode = (latitude: number, longitude: number): any => {
  // Construct the URL with the latitude and longitude
  const url = `https://api.radar.io/v1/geocode/reverse?coordinates=${latitude},${longitude}`;

  // Use the fetch API to make the request
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': process.env.EXPO_PUBLIC_RADAR_API_KEY as string // replace with a production key
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

export const getUserAddress = async (latitude: number, longitude: number) => {
  try {
    const res = await reverseGeocode(latitude, longitude);
    const full_address_data = res.addresses[0];
    const address = {
      city: full_address_data.city,
      state: full_address_data.state,
      country: full_address_data.country,
      zip_code: full_address_data.postalCode,
    };
    return address;
  } catch (err: any) {
    return err.message;
  }
};
