function Spacer({ top = "0px", left = "0px", right = "0px", bottom = "0px" }) {
  return (
    <div
      style={{
        marginTop: top,
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
      }}
    />
  );
}

export default Spacer;
