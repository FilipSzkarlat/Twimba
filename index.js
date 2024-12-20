import { tweetsDataUpload } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let tweetsData = "";

// GENERAL click handling
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.replyBtn) {
    handleReplyBtnClick(e);
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete);
  }
});

// LIKE click handling => increasing and decreasing number of likes
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
    console.log("minus");
  } else {
    targetTweetObj.likes++;
    console.log("plus");
  }
  localStorage.setItem(`${targetTweetObj.uuid}.likes`, targetTweetObj.likes);
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  localStorage.setItem(
    `${targetTweetObj.uuid}.isLiked`,
    JSON.stringify(targetTweetObj.isLiked)
  );
  render();
}

// RETWEET click handling => increasing and decreasing number of retweets
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  localStorage.setItem(
    `${targetTweetObj.uuid}.retweets`,
    targetTweetObj.retweets
  );
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  localStorage.setItem(
    `${targetTweetObj.uuid}.isRetweeted`,
    JSON.stringify(targetTweetObj.isRetweeted)
  );
  render();
}

// Replying click handling => showing and hiding replies
function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

// Tweet click handling => new tweet will be add on the top of the page
function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }

  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}

// Reply btn click handling =>
function handleReplyBtnClick(e) {
  if (e.target.parentElement.children[1].value) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === e.target.dataset.replyBtn;
    })[0];
    targetTweetObj.replies.push({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: e.target.parentElement.children[1].value,
    });
    localStorage.setItem(
      `${targetTweetObj.uuid}.replies`,
      JSON.stringify(targetTweetObj.replies)
    );
    render();
  }
}

// Delete click handling => deleting a tweet
function handleDeleteClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  const index = tweetsData.indexOf(targetTweetObj);
  tweetsData.splice(index, 1);
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
  render();
}

// creating tweet from the data.js file
function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <i class="fa-solid fa-trash tweet-delete" data-delete-reply='${tweet.uuid}'></i>
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    // place for replying to a specific tweet
    repliesHtml += `
    <div class="tweet-reply">
      <div class="tweet-inner">
          <img src="images/scrimbalogo.png" class="profile-pic">
          <div>
              <p class="handle">@Scrimba</p>
              <textarea placeholder="..." class = 'replying-text'></textarea>
              <button class='reply-btn' data-reply-btn ='${tweet.uuid}'>reply</button>
          </div>
      </div>
    </div>`;

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <i class="fa-solid fa-trash tweet-delete" data-delete ='${tweet.uuid}'></i>
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

function localStorageUpdate() {
  if (localStorage["tweetsData"]) {
    tweetsData = JSON.parse(localStorage.getItem("tweetsData"));
  } else {
    tweetsData = tweetsDataUpload;
  }

  tweetsData.forEach((tweet) => {
    const tweetUuidLikes = tweet.uuid + ".likes";
    const tweetUuidIsLiked = tweet.uuid + ".isLiked";
    const tweetUuidIsRetweeted = tweet.uuid + ".isRetweeted";
    const tweetUuidRetweets = tweet.uuid + ".retweets";
    const tweetUuidReplies = tweet.uuid + ".replies";

    if (localStorage[tweetUuidLikes]) {
      tweet.likes = localStorage.getItem(tweetUuidLikes);
      tweet.isLiked = JSON.parse(localStorage.getItem(tweetUuidIsLiked));
    }
    if (localStorage[tweetUuidRetweets]) {
      tweet.retweets = localStorage.getItem(tweetUuidRetweets);
      tweet.isRetweeted = JSON.parse(
        localStorage.getItem(tweetUuidIsRetweeted)
      );
    }
    if (localStorage[tweetUuidReplies]) {
      tweet.replies = JSON.parse(localStorage.getItem(tweetUuidReplies));
    }
  });

  render();
}

localStorageUpdate();
