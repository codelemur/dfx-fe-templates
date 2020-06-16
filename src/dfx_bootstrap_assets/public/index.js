import dfx_bootstrap from 'ic:canisters/dfx_bootstrap';

dfx_bootstrap.greet(window.prompt("Enter your name:")).then(greeting => {
  window.alert(greeting);
});
