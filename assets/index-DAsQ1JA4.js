(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://v2.api.noroff.dev`;async function t(t){let n=await fetch(`${e}${t}`);if(!n.ok)throw Error(`API request failed with status ${n.status}`);return n.json()}async function n(){return(await t(`/pets`)).data}function r(){return setTimeout(i,0),`
    <main class="min-h-screen bg-[#FAFAF7] p-6">
        <h1 class="text-3xl font-bold text-[#2D6A6A]">
        FureverHome
        </h1>

        <p class="mt-4 text-[#2c2c2c]">
        SPA is running!</p>

        <div id="pets-test" class="mt-6 text-[#2c2c2c]">
        Loading pets...
        </div>
    </main>
    `}async function i(){let e=document.querySelector(`#pets-test`);if(e)try{let t=await n();e.innerHTML=`
      <p>Loaded ${t.length} pets from the API.</p>

      <ul>
        ${t.slice(0,5).map(e=>`
          <li>
            ${e.name} - ${e.breed}
          </li>
        `).join(``)}
      </ul>
    `}catch(t){console.error(t),e.innerHTML=`
      <p class="text-red-700">
        Could not load pets.
      </p>
    `}}function a(){return`
    <main class="min-h-screen bg-[#FAFAF7] p-6">
        <h1 class="text-2xl font-bold text-[#2c2c2c]">
        404 - Page Not Found
        </h1>
    </main>
    `}function o(){return`<h1>Listings Page</h1>`}function s(){return`<h1>Create a new pet</h1>`}function c(){return`<h1>Login Page</h1>`}function l(){return`<h1>Register Page</h1>`}function u(){return`<h1>Profile Page</h1>`}function d(){return`<h1>Single Listing Page</h1>`}var f=document.querySelector(`#app`);function p(){if(f)switch(window.location.hash||`#/`){case`#/`:f.innerHTML=r();break;case`#/listings`:f.innerHTML=o();break;case`#/create`:f.innerHTML=s();break;case`#/login`:f.innerHTML=c();break;case`#/register`:f.innerHTML=l();break;case`#/profile`:f.innerHTML=u();break;case`#/listing`:f.innerHTML=d();break;default:f.innerHTML=a()}}p();