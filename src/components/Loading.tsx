import ReactLoading from "react-loading";

const Loading = () => (
  <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
    <ReactLoading
      className="p-0"
      type="spokes"
      color="#883CEF"
      height={"10%"}
      width={"10%"}
    />
  </div>
);

export default Loading;
