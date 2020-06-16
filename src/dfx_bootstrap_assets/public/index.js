import dfx_bootstrap from 'ic:canisters/dfx_bootstrap';
import dfx_bootstrap_assets from 'ic:canisters/dfx_bootstrap_assets';
import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';


export const injectHtml = htmlBytes => {
  const html = new TextDecoder().decode(htmlBytes);
  const el = new DOMParser().parseFromString(html, "text/html");
  document.body.replaceChild(el.firstElementChild, document.getElementById('app'));
};

dfx_bootstrap_assets.__getAsset('index.html').then(res => {
  injectHtml(res);
})
dfx_bootstrap.greet(window.prompt("Enter your name:")).then(greeting => {
  window.alert(greeting);
});
