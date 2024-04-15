
import { Loader } from '@googlemaps/js-api-loader';
const loader = new Loader({
  apiKey: "",
  version: "weekly",
  libraries: ["places"]
});
 function generateLatLong() {
  return new Promise((resolve, reject) => {
  const lat = Math.random() * 180 - 90;
  const long = Math.random() * 360 - 180;
  loader.importLibrary("streetView").then(() => {
    const panorama = new google.maps.StreetViewService();
    panorama.getPanorama({ location: { lat, lng: long },
      preference: google.maps.StreetViewPreference.BEST,
      radius: 50000,
      sources: [google.maps.StreetViewSource.OUTDOOR]
    }, (data, status) => {
      if(status === "OK" && data) {
        const out = (Object.values(data.sG)[0]);
        const latO = out.lat;
        const longO = out.lng;
        console.log(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latO},${longO}`);
        resolve({ lat: latO, long: longO });
      } else {
        console.log("Invalid lat and long");
        resolve(null);
      }
    });
  });
});
}

export default async function findLatLongRandom() {
  console.log('Finding random location...');
  let found = false;
  let output = null;

  while (!found) {
    const data = await generateLatLong();
    if(data) {
      output = data;
      found = true;
    }
  }
  return output;
}
