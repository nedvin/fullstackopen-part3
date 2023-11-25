const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  const successStyle = {
    border: "2px solid green",
    backgroundColor: "lightgrey",
    color: "green",
    padding: "5px",
  };

  const errorStyle = {
    border: "2px solid red",
    backgroundColor: "lightgrey",
    color: "red",
    padding: "5px",
  };

  return <div style={isError ? errorStyle : successStyle}>{message}</div>;
};

export default Notification;
