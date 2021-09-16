module.exports = function (source) {
  console.log("enter loader - replace 'result' to 'myResult'");
  const newSource = source.replace(/result/g, "myResult");
  return newSource;
};
