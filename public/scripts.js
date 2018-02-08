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
    body:
      JSON.stringify({
        email: email.value,
        appName: app.value
      })
  })

    .then(res => {
      return res.json();
    })
    .then(parsedRes => {
      if (parsedRes.token.length > 100) {
        let result = parsedRes.token.split('.');
        accessToken.innerHTML = `
        <h2>Your JWT is: </h2>
        <p>${result[0]}.</p>
        <p>${result[1]}.</p>
        <p>${result[2]}</p>
      `;

      } else {
        accessToken.innerHTML = `<h2>Your JWT is:</h2> <p>${parsedRes.token}</p>`;
      }
    });
};


submitBtn.addEventListener('click', (event) => requestJWT(event));
