/* 
SPA which shows a page with all dance classes and then on hashchange shows a page with individual dance class details.

How it works: 
    1. Clicking on <a>Details</a> changes the hash. 
    2. The hash is matched to name of the dance class from a JSON file (APP.danceClasses from indes.js)
    3. The details for this class are copied into a copy of html template
    4. The template is rendered on the page 
    5. History API saves the SPA 'pages' onto the history array
*/


/* 

/classes OR /classes#unknown

1. Page LOAD on all classes or uknown #
    - show all classes

2. Go BACK  or FORWARD on all classes or on unknown #
    - show all classes
    - delete individual class

/classes#known

1. Page load on known # 
    - keep all classes hidden
    - show individual class

5. Go BACK or FORWARD  on know #
    - show individual class
    - keep all classes hidden


Listener to hashchange. 
Hashchange needs to be triggered:
1. When clicking on <a> and changing the hash (default behaviour)
2. When clicking BACK / FORWARD
3. When initially loading the pages



*/


const DANCE_CLASSES_APP = {

    danceClasses: [],
    ageGroups: ['minis', 'kids', 'juniors', 'adults'],

    // Build and show individual dance class page
    buildShowIndividualClass: function () {

        // name of dance class that needs to be shown on page
        let className = window.location.hash.replace('#', '')
        
        // Cleate a copy of the classpage template
        let clonedTemplate = document.querySelector('template').content.cloneNode(true);
        
        
        // Create the banner section containing title, age, photo and append to clonedTemplate
        
        clonedTemplate.querySelector('.classpage-banner-container').style.backgroundImage = "url(" + DANCE_CLASSES_APP.danceClasses[className].banner.bannerURL + ")"
        clonedTemplate.querySelector('.classpage-banner-box h2').textContent = DANCE_CLASSES_APP.danceClasses[className].banner.title
        clonedTemplate.querySelector('.classpage-banner-box h3').textContent = DANCE_CLASSES_APP.danceClasses[className].banner.age


        // Build the info section all the detailsand append to clonedTemplate

        let df = new DocumentFragment();
        // Build Each element and append to document fragment
        DANCE_CLASSES_APP.danceClasses[className].info.forEach( elem => {

            let div = document.createElement('div');
            let h3 = document.createElement('h3');
            let container = document.createElement('container');

            h3.textContent = Object.getOwnPropertyNames(elem)[0];
            container.innerHTML = elem[Object.getOwnPropertyNames(elem)[0]];   

            // Class to each element to be used for styling
            div.classList.add((Object.getOwnPropertyNames(elem)[0]).toLowerCase().replaceAll(' ', '-'))

            div.appendChild(h3);
            div.appendChild(container)
            df.appendChild(div)
        })
        // Append to clonedTemplate
        clonedTemplate.querySelector('.classpage-info-container').appendChild(df)


        // Append the clonedTemplate templace to main
        document.querySelector('main').appendChild(clonedTemplate)
        document.title = className.replaceAll('_', ' ') + ' | EsuDance'
        history.replaceState({}, document.title)
        // use class active to add fade annimation
        document.querySelector('.classpage-container').classList.add('active'); 
    },
    
    // Dalete individual dance class page
    deleteIndividualClass: function () {
        if (document.querySelector('.classpage-container')) {
            document.querySelector('.classpage-container').remove();
            setTimeout( ()=> {window.scrollTo(0, 0)}, 0)
            
        }

    },

    // Hide all classes 
    hideAllClasses: function () {
        document.querySelector('.all-classes-container').classList.remove('active');
        document.querySelector('.filter-container').classList.remove('active');
    },
    
    // Show all classes page
    showAllClasses: function () {
        document.querySelector('.all-classes-container').classList.add('active')
        document.querySelector('.filter-container').classList.add('active');
        document.title = 'Classes | EsuDance'
        history.replaceState({}, document.title)

    },

    // Filter classes by age group
    filterAllClasses: function() {
        let hash = window.location.hash.replace('#','');
        document.querySelector('.pressed')?.classList.remove('pressed');
        document.querySelector('.visible')?.classList.remove('visible');
        document.querySelector(`.${hash}`)?.classList.add('visible');
        document.querySelector(`[data-classes="${hash}"]`)?.classList.add('pressed');
        
    },

    runAllOnHashChange: function() {

        let className = window.location.hash.replace('#','')

        // If hash value equals any dance class name - show that class
        if (DANCE_CLASSES_APP.danceClasses[className]) {
            DANCE_CLASSES_APP.buildShowIndividualClass();
            DANCE_CLASSES_APP.hideAllClasses();
            NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadEmail();
            NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadMessenger();
            window.scrollTo(0, 0);

            // to reload the contact details for the new page
        }

        /* If there is not hash value or it does not correspond to a class name in danceClasses 
            - show all classes 
            - delete individual class element if it exists*/
        if (window.location.hash === '' || DANCE_CLASSES_APP.danceClasses[className] == undefined) {
            DANCE_CLASSES_APP.showAllClasses();
            DANCE_CLASSES_APP.deleteIndividualClass();
        }
        // Filter and show only the required class
        if (DANCE_CLASSES_APP.ageGroups.indexOf[window.location.hash.replace('#','')] != -1 ) {
            DANCE_CLASSES_APP.filterAllClasses();

        }
    },


    init: function() {

        fetch('json/dance-classes.json')
        .then((response) => response.json())
        .then((data => {
            
            // store the data
            DANCE_CLASSES_APP.danceClasses = data;

            // On hashchange
            window.addEventListener('hashchange', DANCE_CLASSES_APP.runAllOnHashChange);

            // Dispatch hashChange on page load
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            
            // On button click of individual class
            document.querySelectorAll('.dance-class-button-container a')
                .forEach( link => link.addEventListener('click', DANCE_CLASSES_APP.runAllOnHashChange))

            // Change hash on button click
            document.querySelectorAll('.tabs button')
                .forEach( button => {button
                    .addEventListener('click', (ev) => {
                        window.location.hash = ev.currentTarget.dataset.classes 
                    })
                })
            }))            
        
            



    }
}

DANCE_CLASSES_APP.init();

