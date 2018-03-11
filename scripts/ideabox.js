//Global Variables
var ideas = [] ;
var localStorageKey = "localStorageKey";

//On load
$(document).ready(function() {
  grabIdea();
  createTemplate();
})

//Idea constructor
function IdeaTemplate(saveIdeaTitle, saveIdeaBody) {
  this.title = saveIdeaTitle;
  this.body = saveIdeaBody;
  this.quality = 'swill';
  this.id = Date.now();
}

// Saves idea and updates local storage array
function saveIdea() {
  var saveIdeaTitle = $('#title-field').val();
  var saveIdeaBody = $('#body-field').val();
  var idNumber = new IdeaTemplate(saveIdeaTitle, saveIdeaBody);
  ideas.push(idNumber);
  setToStorage();
}

//Grabs idea out of local storage and updates array
function grabIdea() {
  var storedIdea = localStorage.getItem(localStorageKey);
  var parsedIdea = JSON.parse(storedIdea);
  ideas = parsedIdea || [];
}

//Event Listeners
$('#save-btn').on('click', attachTemplate);
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', upVoteIdeaStorage);
$('#idea-placement').on('click', '.down-arrow', downVoteIdeaStorage);

// Template creator
function createTemplate() {
  $('#idea-placement').html('');
  ideas.forEach(function(object) {
    $('#idea-placement').prepend(
      `<article aria-label="Idea card" class="object-container" id="${object.id}">
        <div class="flex-container">
          <h2 class="entry-title" contenteditable="true">${object.title}</h2>
          <div role="button" class="delete-button"></div>
        </div>
        <p class="entry-body" contenteditable="true">${object.body}</p>
        <div role="button" class="up-arrow" alt="upvote button"></div>
        <div role="button" class="down-arrow" alt="downvote button"></div>
        <p class="quality-rank">quality: 
          <span class="open-sans">${object.quality}</span>
        </p>
      </article>`
    );
  });
}

// prepend the template function
function attachTemplate(event) {
  event.preventDefault();
  saveIdea();
  grabIdea();
  createTemplate();
  clearInputs();
}

// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}

function deleteIdea() {
  var grandParentId = $(this).closest('article').attr('id');
  var stringIdeas;
  ideas.forEach(function(item) {
    if (grandParentId == item.id) {
      ideas.splice(item, 1);
      setToStorage();
    }
  });
  $(this).closest('article').remove();
}

// Arrow button functionality
$('#idea-placement').on('click', '.up-arrow', function() {
  var thisIdeaQuality = $(this).closest('div').siblings('p').children(
    'span');
  upVoteIdea(thisIdeaQuality);
});

function upVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  }
}

$('#idea-placement').on('click', '.down-arrow', function() {
  var thisIdeaQuality = $(this).siblings('p').children('span');
  downVoteIdea(thisIdeaQuality);
});

function downVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'genius') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('swill');
  }
}

function upVoteIdeaStorage() {
  var grandParentId = $(this).parent()[0].id;
  ideas.forEach(function (item) {
    if (grandParentId == item.id && item.quality == 'swill') {
      item.quality = 'plausible';
    } else if (grandParentId == item.id && item.quality == 'plausible') {
      item.quality = 'genius';
    }
  });
  setToStorage();
}

function downVoteIdeaStorage() {
  var grandParentId = $(this).parent()[0].id;
  ideas.forEach(function (item) {
    if (grandParentId == item.id && item.quality == 'genius') {
      item.quality = 'plausible';
    } else if (grandParentId == item.id && item.quality == 'plausible') {
      item.quality = 'swill';
    }
  });
  setToStorage();
  }

//Search function and Event
$('#search-field').on('keyup', function() {
  var searchInput = $('#search-field').val();
  var searcher = new RegExp(searchInput, 'gim');
  $('.object-container').each(function() {
    var title = $(this).find(".entry-title").text();
    var body = $(this).find(".entry-body").text();
    var match = (title.match(searcher) || body.match(searcher));
    if (!match) {
      $(this).hide();
    } else {
      $(this).show();
    }
  })
});

// Editable 
$('#idea-placement').on('blur', '.entry-title', function(e) {
    var newTitle = $(this).text();
    editableTitle(this, newTitle);
});

function editableTitle(location, newText) {
    var objectId = $(location).parent().parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.title = newText;
            return object.title;
        }
    });
  setToStorage();
}

$('#idea-placement').on('blur', '.entry-body', function(e) {
    var newBody = $(this).text();
    editableBody(this, newBody);
});

function editableBody(location, newText) {
    var objectId = $(location).parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.body = newText;
            return object.body;
        }
    });
  setToStorage();
}

// Expanding Text Area
var expandingTextArea = (function(){
  var textAreaTag = document.querySelectorAll('textarea')
  for (var i=0; i<textAreaTag.length; i++){
    textAreaTag[i].addEventListener('paste',autoExpand);
    textAreaTag[i].addEventListener('input',autoExpand);
    textAreaTag[i].addEventListener('keyup',autoExpand);
  }
  function autoExpand(e,el){
    var el = el || e.target;
    el.style.height = 'inherit';
    el.style.height = el.scrollHeight+'px';
  }
})()

function setToStorage() {
   var stringIdeas = JSON.stringify(ideas);
   localStorage.setItem(localStorageKey, stringIdeas);
}




