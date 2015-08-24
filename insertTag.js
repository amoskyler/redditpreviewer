(function(){
  'use strict';

  var config = {
    url: "https://16e45952.ngrok.io"
  }

  function findEligibleLinks () {
    var element, validElements,
        titleElement, domainElement,
        elements, titleTextElement;

    var elements = document.getElementsByClassName('link')
    validElements = [];
    for(var idx in elements){
      element = elements[idx];
      if(typeof element === 'object'){
        titleElement = element.getElementsByClassName('title')[0];
        titleTextElement = titleElement.getElementsByClassName('title')[0];
        domainElement = titleElement.getElementsByClassName('domain')[0];
        if(domainElement.innerHTML.indexOf('imgur') !== -1){
          validElements.push(element)
        }
      }
    }
    return validElements;
  }

  function submitShareable (linkId, element, cb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", config.url);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.responseType = 'json';
    xmlHttp.onload = function () {
      var response = xmlHttp.response;
      if (response.err != null) return cb(element, 'Error creating shareable link');

      cb(element, response.value);
    }
    xmlHttp.send(JSON.stringify(linkId));
  }

  function displayUri (element, value) {
    var link = document.createElement('a');
    var linkText = document.createTextNode(value);
    link.appendChild(linkText);
    link.href = value
    link.className = 'rp-link'
    element.appendChild(link);
    element.removeChild(element.getElementsByClassName('rp-button')[0]);
  }

  function generateCopy (elements) {
    var titleTextElement, element,
        htmlString, button, linkData,
        postFullname, targetElement;

    for(var idx in elements){
      element = elements[idx];
      titleTextElement = element.getElementsByClassName('title')[0].getElementsByClassName('title')[0];
      postFullname = element.getAttribute('data-fullname');
      targetElement = element.getElementsByClassName('title')[0];
      linkData = {
        uri: titleTextElement.href,
        title: titleTextElement.innerHTML,
        fullname: postFullname
      };
      // select post elements which don't have button already
      if (element.getElementsByClassName('rp-link').length > 0){
          // no-op.. we don't want to add a button if we already have a link
      }
      else if (element.getElementsByClassName('rp-button').length < 1) {
        // Create button with text "Shareable Link" and class="rp-button"
        // Add event listner to submit on click
        button = document.createElement('button');
        button.className = 'rp-button';
        button.appendChild(document.createTextNode('Shareable Link'));
        button.addEventListener('click', submitShareable.bind(null, linkData, targetElement, displayUri));
        //append to post title element
        targetElement.appendChild(button);
      }
    }
  }

  var elegibleLinks;
  elegibleLinks = findEligibleLinks();
  generateCopy(elegibleLinks);

  window.addEventListener('neverEndingLoad', function (e) {
    // naive implementation to update buttons on links
    // TODO: only update untagged elements
    elegibleLinks = findEligibleLinks();
    generateCopy(elegibleLinks);
  });
})();
