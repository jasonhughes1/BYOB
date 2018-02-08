const submitBtn = document.querySelector('#submit-btn');
const email = document.querySelector('#email-input');
const app = document.querySelector('#app-name-input');
const accessToken = document.querySelector('.access-token-container');

const requestJWT = (event) => {
  event.preventDefault();
  fetch('/api/v1/authenticate', {
    method: 'POST',
    headers: {
      'content-type' : 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      appName: app.value
    })
  })

    .then(res => {
      if(res.status === 201) {
        return res.json()
      } else {
        return {
          token: 'Please enter a Turing.io email'
        }
      }
    })
    .then(parsedRes => {
      console.log(parsedRes);
      accessToken.innerHTML = '<h2>Your JWT is:</h2> ' + parsedRes.token;
    });
};


submitBtn.addEventListener('click', (event) => requestJWT(event));
