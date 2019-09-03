$(document).ready(function() {
    // Reference to the article container div inside of which we will be rendering the articles.
    var articleContainer = $(".article-container");
    // Adding event listeners for dynamically generated buttons for deleting articles, 
    // pulling up article notes, saving article notes, and deleting article notes.
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        // Empty article container, run AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true")
            .then(function(data) {
                // If there are headlines, render them to the page
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    // Or render message saying there are no new messages
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        // This function appends HTML containing article data to the page.
        // We get an array of JSON containing all available articles in database
        var articlePanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all of the HTML for the articles stored in our articlePanels array,
        // append them to the articlePanels container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        // This function takes in a single JSON object for an article/headline
        // It constructs a jQuery element containing all of the formatted HTML for the article panel
        var panel =
        $(["<div class='panel panel-default'>",
           "<div class='panel-heading'>",
           "<h3>",
            article.headline,
           "<a class='btn btn-success save'>",
           "Delete From Saved",
           "</a>",
           "</h3>",
           "</div>",
           "<div class='panel-body'>",
           article.summary,
           "</div>",
           "</div>"
        ].join(""));
        // We attach the article's id to the jQuery element
        // We will use this when trying to figure out which article the user wants to save
       panel.data("_id", article._id);
         //We return the constructed jQuery element
         return panel; 
    }

    function renderEmpty() {
        // This function renders some HTML to the page telling us we don't have any articles to view
        // using a joined array of HTML string data data because it's easier to read/change than a 
        // concatenated string
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Poop! No saved articles!</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        // This function handles rendering note list items to our notes modal,
        // setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If we have no notes, just display a message explaining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; data.notes.length; i++) {
                // Constructs an li element to contain our noteText and a delete button
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                // Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // Adding our currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        // This function handles the deleting of articles
        // We grab the id of the article to delete from the panel 
        // element inside of which sits the delete button
        var articleToDelete = $(this).parents(".panel").data();
        // Using a delte method here just to be semantic since we are deleting an article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            // If this works out, run initPage again which will re-render our list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        // This function handles opening the notes modal and displaying our notes
        // Grab the id of the article to get notes for the panel element inside of which the delete button sits
        var currentArticle = $(this).parents(".panel").data();
        // Grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            // Constructing our initial HTML to add to the notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Add some information about the article and article notes to the save button
            // for easy access
            // When trying to add a new note
            $(".btn.save").data("article", noteData);
            // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        // This function handles what happens when a user tries to save a new note for an article.
        // It sets a variable to hold some formatted data about our note,
        // grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        // If we actually have data typed into the note input field, format it
        // and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                notetext: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                // When complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        // This function handles the deletion of notes
        // First, we grab the id of the note we want to delete
        // We store this date on the delete button when we created it
        var noteToDelete = $(this).data("_id");
        // Perform a DELETE request to "/api/notes/" with the id of the 
        // note we're deleting as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            // When done, hide the modal
            bootbox.hideAll();
        });
    }
});