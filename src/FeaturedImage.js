import "./App.css";

import { Html } from "@react-three/drei";

function FeaturedImage(props) {
  return (
    <>
      <Html transform position={props.position} rotation={props.rotation}>
        <img src={props.data.image} alt="thumbnail" width={props.data.size} height={props.data.size} />
        {/* <p className="flip">{props.data.title}</p> */}
      </Html>
    </>
  );
}

export default FeaturedImage;
