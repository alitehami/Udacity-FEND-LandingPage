/**
 *ali.tehami@yahoo.com
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 * Author: Ali Tehami
 */

// gets the app.js executed only after the Document is loaded.
// testing for doc's readyness
// console.log(document.readyState);
document.addEventListener("DOMContentLoaded", function (
  DOMContentLoaded_event
) {
  //debugging
  // console.log("ali");
  // console.log(DOMContentLoaded_event);

  /**
   * Define Global Variables
   *
   */
  //add setTimeout() functoion to grab these global containers on Doc loaded?...

  // get the navBar container unordered list element
  let navBar = document.querySelector("header>nav>ul#navbar__list");
  // console.log(navBar);

  //get the mian containers to hold the sections
  let bodyMain = document.querySelector("body>main");
  let mainSections = bodyMain.getElementsByTagName("section");
  //set the active section to first elemnent by default
  const activeClassName = "active-section";
  let ActiveSectionIndex = 0;
  //grab the addSections button
  let addSectionButton = navBar.querySelector("#buttonAdd");
  let homeButton = navBar.querySelector("#buttonHome");

  /**
   * End Global Variables
   * Start Helper Functions
   *
   */

  //check if an element is within a % of the view's height
  //some useful stackoverflow question that helped with this:
  //https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
  function isSectionInView(sec) {
    let box = sec.getBoundingClientRect();
    let p = 0.4;
    return (
      box.top <= p * window.innerHeight && box.top >= -p * window.innerHeight
    );
  }

  //check which section element is in view
  function activeSectionIndex() {
    let curActive = Array.from(mainSections, (i) => isSectionInView(i));
    //   console.log(`section ${curActive.indexOf(true) + 1}`)
    let activeInd = curActive.indexOf(true);

    //this check below causes issues in mobile view modes on chrome dev tools,
    //but prevents from having a -1 result in when on top of the page
    //and beyond the set limit of the sections margins
    if (activeInd < 0) {
      activeInd = 0;
    }

    return activeInd;
  }

  //adding a new section to the main body container
  function addNewSection() {
    let newSec = bodyMain.appendChild(mainSections[0].cloneNode(true));
    return newSec;
  }

  //fixing the data of the newly added section
  function fixNewSectionData() {
    let curLength = mainSections.length;
    let sec = mainSections[curLength - 1];
    let name = "Section " + curLength;
    sec.dataset.nav = name;
    sec.querySelector("h2").textContent = name;
    sec.id = "section" + curLength;
    console.log(sec.dataset.nav);
  }

  /**
   * End Helper Functions
   * Begin Main Functions
   *
   */

  function buildNewNavLink(sec) {
    let fragNavItems = document.createDocumentFragment();
    let nav = document.createElement("li");
    let link = document.createElement("a");
    let secId = sec.id;
    link.textContent = sec.dataset.nav;
    link.classList.add("menu__link");
    link.setAttribute("href", `#${secId}`);
    nav.append(link);
    fragNavItems.append(nav);
    addSectionButton.parentElement.parentElement.insertBefore(
      fragNavItems,
      addSectionButton.parentElement
    );
    return sec;
  }

  //assign Active sections to navBar & Sections
  function updateActive(oldInd, newInd) {
    navBar.children[oldInd].children[0].classList.remove("active-section");
    navBar.children[newInd].children[0].classList.add("active-section");
    mainSections[oldInd].classList.remove("active-section");
    mainSections[newInd].classList.add("active-section");
  }

  //update scroll indicator width ref: https://www.w3schools.com/howto/howto_js_scroll_indicator.asp
  function scrollIndicatorWidthUpdater() {
    let winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    let height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }

  /*handeling scroll events for active sections detection... NEEDS MORE WORK TO IMPLEMENET
   *many performance problems with throtteling, reflow and repaint issues..
   *ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
   *ref: https://www.html5rocks.com/en/tutorials/speed/animations/
   */

  /**
   * End Main Functions
   * Begin Events
   *
   *
   * ali <<-- this is by my 4yo son, Aboody, learning how to write my name :D
   *
   */

  // Build initial state of the navBar menu
  Array.from(mainSections).forEach((sec) => buildNewNavLink(sec));


 /* 
  *there are other ways to optimise performance when detecting if objects are in view (instead of window.OnScroll event), 
  *like using the Intersection Observer API
  *https://usefulangle.com/post/113/javascript-detecting-element-visible-during-scroll 
  */
  // Window OnScroll Event listener.. setting Active sections and updating scroll indicator's width
  window.addEventListener("scroll", function () {
    setTimeout(() => {
      //update Active index
      let CurActiveSectionIndex = activeSectionIndex();
      console.log(`the active section is ${CurActiveSectionIndex}`);
      updateActive(ActiveSectionIndex, CurActiveSectionIndex);
      ActiveSectionIndex = CurActiveSectionIndex;

      //update scroll indicator
      scrollIndicatorWidthUpdater();
    }, 0);
  });

 

  //Adding a New Section..
  addSectionButton.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      // console.log("ali");
      let newSec = addNewSection();
      fixNewSectionData();
      buildNewNavLink(newSec);

      setTimeout(() => {
        newSec.scrollIntoView({ behavior: "smooth" });
      }, 0);
    },
    false
  );

  //Great reference for Smooth Scrolling: https://css-tricks.com/snippets/jquery/smooth-scrolling/
  //Home Button, takes the user to the top of the page
  homeButton.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      setTimeout(() => {
        // document.querySelector("body").scrollIntoView({ behavior: "smooth" });
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      }, 0);
    },
    false
  );

  ///ONDOCUMENTLOADED Event Listener End
});
