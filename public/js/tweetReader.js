/*
 * tweetReader.js
 * by Paul Brady
 *
 * Listens for newly generated tweet data, and displays it.
 */

 var ttimer = null;

var getTweetBlock = function( userName, tweetText, tweetTime) {
  var tweetHTMLBlock = '<img src=http://placehold.it/40x40/FFB5A5 class=profileTweet_img>' +
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
  clearTimeout(ttimer);
};

var showCurrentTweets = function() {
  $("#filterHeaderMsgId").text("");

  var $tweetContent = $('#tweetContent');
  $tweetContent.html('');

  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = $('<div class=tweet></div>');
    $tweet.html( getTweetBlock(tweet.user, enableHashtagLinks(tweet.message), getFormattedDate(tweet.created_at) ) );
    $tweet.appendTo($tweetContent);
    index -= 1;
  }
  clearTimeout(ttimer);
};

var timedTweetChecker = function(){
  showCurrentTweets();
  ttimer = setTimeout(timedTweetChecker, Math.random() * 3000);
};


$(document).ready(function(){

  $("#homeButton").on("click", function() {
    showCurrentTweets();
  });

  $("#refreshButton").on("click", function() {
    showCurrentTweets();
  });

  timedTweetChecker();

});


