export const initialFetch = () => {
  return fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=2&api_key=DEMO_KEY')
    .then(response => response.json())
    .then(parsedResponse => console.log(parsedResponse));
