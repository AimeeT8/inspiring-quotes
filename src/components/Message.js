import React from "react";

const Message = ({ removeMessage, messageText }) => {
  return (
    <div className="message">
      <p>{messageText}</p>
      <span className="close-message" onClick={removeMessage}>
        X
      </span>
    </div>
  );
};

export default Message;
