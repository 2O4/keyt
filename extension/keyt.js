let generatePassword = document.getElementById("generatePassword");

function encode_ascii85(a) {
  var b, c, d, e, f, g, h, i, j, k;
  for (
    !/[^\x00-\xFF]/.test(a),
    b = "\x00\x00\x00\x00".slice(a.length % 4 || 4),
    a += b,
    c = [],
    d = 0,
    e = a.length;
    e > d;
    d += 4
  )
    f = (a.charCodeAt(d) << 24)
      + (a.charCodeAt(d + 1) << 16)
      + (a.charCodeAt(d + 2) << 8)
      + a.charCodeAt(d + 3),
    0 !== f ? (
      k = f % 85, f = (f - k) / 85,
      j = f % 85, f = (f - j) / 85,
      i = f % 85,
      f = (f - i) / 85, h = f % 85,
      f = (f - h) / 85,
      g = f % 85, c.push(g + 33, h + 33, i + 33, j + 33, k + 33)
    ): c.push(122);
  return function (a, b) {
    for (var c = b; c > 0; c--) {
      a.pop()
    }
  }(c, b.length), String.fromCharCode.apply(String, c);
}

async function sha256(data) {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function genPassword2(d, u, m, c = "", l = 40) {
  const data = d.toLowerCase() + c + u + m;
  const data_hash = await sha256(data);
  const a85_pass = encode_ascii85(data_hash);
  return a85_pass;
}

generatePassword.addEventListener("click", async () => {
  event.preventDefault();

  var password = genPassword()
  copyTextToClipboard(password);
  // genPassword(d, u, m).then((password) => copyTextToClipboard(password));
});

let domain = document.getElementById("domain");
let username = document.getElementById("username");
let master_password = document.getElementById("master_password");

function genPassword() {
  let d = document.getElementById("domain").value;
  let u = document.getElementById("username").value;
  let m = document.getElementById("master_password").value;

  data = u + d + m;
  return data;
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  var successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text);
}
