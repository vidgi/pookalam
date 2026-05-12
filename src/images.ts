import img01 from "./img/01.webp";
import img02 from "./img/02.webp";
import img03 from "./img/03.webp";
import img04 from "./img/04.webp";
import img05 from "./img/05.webp";
import img06 from "./img/06.webp";
import img07 from "./img/07.webp";
import img08 from "./img/08.webp";
import img09 from "./img/09.webp";
import img10 from "./img/10.webp";

export const IMAGES: readonly string[] = [
  img01,
  img02,
  img03,
  img04,
  img05,
  img06,
  img07,
  img08,
  img09,
  img10,
];

export const IMAGE_LABELS: readonly string[] = IMAGES.map((_, i) => `petal ${i + 1}`);
