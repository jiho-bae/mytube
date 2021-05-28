import { Redshift } from "aws-sdk";
import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addFakeComment = (comment) => {
  const li = document.createElement("li");
  const avatar = document.createElement("img");
  const userDiv = document.createElement("div");
  const userIdDiv = document.createElement("div");
  const userId = document.createElement("a");
  const notifySpan = document.createElement("span");
  const userComment = document.createElement("p");
  const delComment = document.createElement("a");
  /*  const delCommentA = document.createElement("a");
  const delCommentBtn = document.createElement("button");*/

  userDiv.classList.add("u-comment");
  userIdDiv.classList.add("u-comment-id");
  avatar.classList.add("u-commenter-avatar");
  avatar.src = comment.avatarUrl;
  userId.href = `/users/${comment.creator}`;
  userId.innerText = comment.name;
  notifySpan.innerText = `방금 막`;
  userComment.innerHTML = comment.text;
  delComment.classList.add("delComment");
  delComment.href = `/videos/${comment.videoId}/${comment["_id"]}/delete`;
  delComment.innerHTML = `<button class="delCommentBtn id="JsDelCmtBtn"><i class="far fa-trash-alt"></i></button>`;

  userIdDiv.appendChild(userId);
  userIdDiv.appendChild(notifySpan);
  userDiv.appendChild(userIdDiv);
  userDiv.appendChild(userComment);
  li.appendChild(avatar);
  li.appendChild(userDiv);
  li.appendChild(delComment);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200 && response.data !== "") {
    addFakeComment(response.data.newComment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  if (commentInput.value === "") {
    commentInput.value = "";
  } else {
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
  }
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
