const fetch = require('node-fetch');
(async () => {
  const bad = '\\{"role":"Frontend Developer","resumeText":"Windows curl escaped body"}';
  console.log('Sending bad body:', bad);
  const res = await fetch('http://localhost:3000/api/interview/questions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-dev-user': 'true' }, body: bad });
  console.log('status', res.status);
  console.log(await res.text());
})().catch(e=>console.error(e));
