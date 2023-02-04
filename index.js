let pagedata = { "saveforlater": [], "comments": [] };

/* When the page loads, we check to see whether it is the first time we are
loading this page or not. If it is the first time we are loading the page,
we initialise the values we want to store in sessionStorage. If it is not the
first time we are loading the page, then we can assume that we already have some information
about pagedata objects stored in SessionStorage. We use this information in sessionStorage to add information 
about each book object we have created to our HTML page. */
// for index.html
function pageLoad() {

    let tblComments = document.getElementById("comments");
    tblComments.style.visibility = "hidden";

    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("pagedata", JSON.stringify(pagedata));
        sessionStorage.setItem("hasCodeRunBefore", true);
    } else {
        //Get the array of comments objects from sessionStorage and assign it to the array 'arrComment'
        arrComments = JSON.parse(sessionStorage.getItem("pagedata")).comments;

        // empty the table and refill it
        while (tblComments.rows.length > 1) {
            tblComments.deleteRow(1);
        }

        //Loop through each comment (item) in the arrComments array and create comments table
        arrComments.forEach(function (item) {
            let trElm = document.createElement("tr");

            // Add like
            let tdElm = trElm.insertCell(-1);
            tdElm.innerHTML = item.like ? "Liked" : "Unliked";


            // Add comment
            let tdElm1 = trElm.insertCell(-1);
            tdElm1.innerHTML = item.comment;

            tblComments.appendChild(trElm);
        });

        tblComments.style.visibility = arrComments.length > 0 ? "visible" : "hidden";

    }
}

// for saveforlater.html
function pageLoadSave() {

    let tblSaveForLater = document.getElementById("saveforlater");
    tblSaveForLater.style.visibility = "hidden";

    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("pagedata", JSON.stringify(pagedata));
        sessionStorage.setItem("hasCodeRunBefore", true);
    } else {
        //Get the array of comments objects from sessionStorage and assign it to the array 'arrSaveForLater'
        arrSaveForLater = JSON.parse(sessionStorage.getItem("pagedata")).saveforlater;

        // empty the table and refill it
        while (tblSaveForLater.rows.length > 1) {
            tblSaveForLater.deleteRow(1);
        }

        //Loop through each comment (item) in the arrSaveForLater array and create SFL table
        arrSaveForLater.forEach(function (item, index) {
            let trElm = document.createElement("tr");

            // Add Url
            let tdElm = trElm.insertCell(-1);
            tdElm.innerHTML = `<a href="index.html#${item.id}">${item.id}</a>`;

            // Add delete button
            let tdElm1 = trElm.insertCell(-1);
            tdElm1.innerHTML = "Remove";
            tdElm1.setAttribute('onclick', `removeSFL(${index})`);

            tblSaveForLater.appendChild(trElm);
        });

        tblSaveForLater.style.visibility = arrSaveForLater.length > 0 ? "visible" : "hidden";

    }
}


//Below we create the constructor function that will be used to create all SaveForLater objects.
class SaveForLater {
    constructor(id) {
        this.id = id;
    }
}

//Below we create the constructor function that will be used to create all Like/Comment objects.

class LikeAndComment {
    constructor(like, comment) {
        this.like = like;
        this.comment = comment;
    }
}


/* the function below will be called every time the user clicks on the button to add a comment on the 
HTML page.We then add the object to the pagedata.comments objects using the push method. Because we want this information to be available accross page loads, we add the updated pagedata to sessionStorage. */

/**
 * Add a new comment to storage
 */
function AddComment() {
    pagedata = JSON.parse(sessionStorage.getItem("pagedata"));

    let newLikeAndComment = new LikeAndComment(
        document.querySelector('input[name="topic"]:checked').value == 1 ? true : false,
        document.getElementById("comment").value,

    );
    pagedata.comments.push(newLikeAndComment);


    sessionStorage.setItem("pagedata", JSON.stringify(pagedata));
}


/**
 * Remove a SFL from array
 * @param {Number} index - index in the array
 */
function removeSFL(index) {
    pagedata = JSON.parse(sessionStorage.getItem("pagedata"));
    pagedata.saveforlater.splice(index, 1);
    sessionStorage.setItem("pagedata", JSON.stringify(pagedata));
    pageLoadSave();
}


/**
 * Add a SFL from array
 * @param {String} id - SFL id on the page
 */
function AddSFL(id) {

    pagedata = JSON.parse(sessionStorage.getItem("pagedata"));

    // Is it exist in the SFL ?
    let newIndex = pagedata.saveforlater.findIndex((item) => item.id == id);
    if (newIndex == -1) {
        /*When an item is added, an alert should tell the user how many items are in their “Save for later” folder*/
        let newSaveForLater = new SaveForLater(id);
        pagedata.saveforlater.push(newSaveForLater);
        sessionStorage.setItem("pagedata", JSON.stringify(pagedata));
        alert(`Saved.\n ${pagedata.saveforlater.length} item(s) in your save for later folder`);
    }
    else {
        alert("This item already exists in the save for later personal folder");
    }

}
