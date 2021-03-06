/*
 * tweetReader.js
 * by Paul Brady
 *
 * Listens for newly generated tweet data, and displays it.
 */

var tweetsPerWindow = 11;
var tweetCounterOffset = tweetsPerWindow;
var lastTweetCounterOffset = tweetCounterOffset;
var INPUT_PROMPT_STR = 'What\'s happening?';


// JS to jQuery UTILITY



// JS UTILITY
var getTweetBlock = function( userName, tweetText, tweetTime) {
  var tweetHTMLBlock = '<img src=http://placehold.it/70x70/008000 class=profileTweet_img>' +
                         '<span class="tweetTextBlk tweetTxt group">' + 
                           '<span class="tweetUser"><a onclick="showUserFilteredTweets(\'' + userName + '\');">@' + userName + '</a></span>&nbsp;&#183&nbsp;<span class="lightTxt tweetDate">' + tweetTime + '</span><br>' + 
                           tweetText + '<br><br></span>';

  return tweetHTMLBlock;
}

var enableHashtagLinks = function(raw) {
  var retVal = "";
  if (raw.indexOf("#")==-1) {
    retVal=raw;
  } else {
    // retVal = raw.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<a href=index.html?q=no-hash-searches-yet>#$2</a>').replace("#", "");
    retVal = raw.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<u>$2</u>');
  }
  return retVal;
};

var getFormattedDate = function( d ) {
  return d.toLocaleTimeString() + " - " + d.toLocaleDateString();
};




// VIEW NEW TWEETS


// Updated by data_generator ONLY
var updateViewNewTweetsText = function() {
  if( window.streams.home.length<=tweetsPerWindow ) {
    return;
  }

  var total = window.streams.home.length - tweetCounterOffset;

  if( total===0 ) {
    // document.getElementById('newTweetNotif').style.display = "none";
    newTweetNotifClose();

  } else if( total>1 ) {
    document.getElementById('newTweetNotif').innerHTML = "View " + total + " new Tweets";
    // document.getElementById('newTweetNotif').style.display = "block";
    newTweetNotifOpen();

  } else if( total===1 ) {
    document.getElementById('newTweetNotif').innerHTML = "View 1 new Tweet";
    // document.getElementById('newTweetNotif').style.display = "block";
    newTweetNotifOpen();

  }

}



// POST A USER'S TWEET
var showInputField = function( aUser ) {
  var $tweetPost = $('#tweetPost');
  $tweetPost.html('');

  var $tweet = $('<div class=tweetPost></div>');
  $tweet.html( getTweetBlock(tweet.aUser, '', '') );
  $tweet.appendTo($tweetPost);

};




// TWEET LOG
var showUserFilteredTweets = function( aUser ) {
  var $tweetContent = $('#tweetContent');
  $tweetContent.html('');

  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    if (tweet.user == aUser) {
      var $tweet = $('<div class=tweet></div>');
      $tweet.html( getTweetBlock(tweet.user, enableHashtagLinks(tweet.message), getFormattedDate(tweet.created_at) ) );
      $tweet.appendTo($tweetContent);
    }
    index -= 1;
  }
};

var showCurrentTweets = function() {
  var $tweetContent = $('#tweetContent');
  $tweetContent.html('');

  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = $('<div class=tweet></div>');
    if(index > lastTweetCounterOffset) {
      $tweet = $('<div class="tweet tweetReveal"></div>');
    }
    $tweet.html( getTweetBlock(tweet.user, enableHashtagLinks(tweet.message), getFormattedDate(tweet.created_at) ) );
    $tweet.appendTo($tweetContent);
    index -= 1;
  }

};


// ON READY
$(document).ready(function(){

  ///// "View XX new Tweets" message
  window.newTweetNotifOpen = function()
  {
    console.log("newTweetNotifOpen");
    $("#newTweetNotif").slideDown();
  };
  window.newTweetNotifClose = function()
  {
    console.log("newTweetNotifClose");
    $(".tweetReveal").hide();
    $("#newTweetNotif").slideUp("fast", function() {
      $(".tweetReveal").fadeIn(1000, function() {
        lastTweetCounterOffset = streams.home.length - 1;
      });
    });
  };
  newTweetNotifClose();



  //// BUTTON LISTENERS
  $( "#newTweetNotif" ).click(function() {
    tweetCounterOffset = window.streams.home.length;
    showCurrentTweets();
    newTweetNotifClose();
  });

  $("#homeButton").on("click", function() {
    showCurrentTweets();
  });

  $("#refreshButton").on("click", function() {
    showCurrentTweets();
  });


  $("#tweetInput").on("click", function() {
    if($(this).val() === INPUT_PROMPT_STR) {
      $(this).html('');
    }
  });

  $("#tweetInput").on("blur", function() {
    if($(this).val() === '') {
      $(this).html(INPUT_PROMPT_STR);
    }
  });


  //// DISPLAY PAGE ELEMENTS
  showCurrentTweets();

});

