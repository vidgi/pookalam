import "./App.css";

import FeaturedImage from "./FeaturedImage";

function PetalRing(props) {
  return (
    <>
      <FeaturedImage position={[-20, 0, 55]} data={props.data} rotation={[0 * (Math.PI / 180), 180 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-5, 0, 51]} data={props.data} rotation={[0 * (Math.PI / 180), -150 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[6, 0, 40]} data={props.data} rotation={[0 * (Math.PI / 180), -120 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[10, 0, 25]} data={props.data} rotation={[0 * (Math.PI / 180), -90 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[6, 0, 10]} data={props.data} rotation={[0 * (Math.PI / 180), -60 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-5, 0, -1]} data={props.data} rotation={[0 * (Math.PI / 180), -30 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-20, 0, -5]} data={props.data} rotation={[0 * (Math.PI / 180), 0 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-35, 0, -1]} data={props.data} rotation={[0 * (Math.PI / 180), 30 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-46, 0, 10]} data={props.data} rotation={[0 * (Math.PI / 180), 60 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-50, 0, 25]} data={props.data} rotation={[0 * (Math.PI / 180), 90 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-46, 0, 40]} data={props.data} rotation={[0 * (Math.PI / 180), 120 * (Math.PI / 180), 0]} />
      <FeaturedImage position={[-35, 0, 51]} data={props.data} rotation={[0 * (Math.PI / 180), 150 * (Math.PI / 180), 0]} />
    </>
  );
}

export default PetalRing;
