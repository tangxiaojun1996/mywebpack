import add from "./add.js";

const result = add(1, 2);

if (document) {
  const h1 = document.createElement("h1");
  h1.innerText = `Hello MyWebpack! \n result is ${result}`;
  document.body.appendChild(h1);
}
