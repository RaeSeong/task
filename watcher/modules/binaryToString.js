module.exports = (buf, option) => {

  let arrayBuffer = new Uint8Array(buf);
  let s = String.fromCharCode.apply(null, arrayBuffer);
  s = decodeURIComponent(s);

  if (option === "object") {
    s = JSON.parse(s);
  }
  return s;
}