const laptops = [
  {
    model: "XPS-15",
    price: 899.99,
    cpu: "i5 13th gen",
    gpu: "RTX 3050",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "Inspiron 15",
    price: 749.99,
    cpu: "Intel i5-1235U",
    gpu: "Intel Iris Xe",
    ram: "8GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "Pavilion Gaming",
    price: 999.99,
    cpu: "Ryzen 5 5600H",
    gpu: "GTX 1650",
    ram: "16GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "EliteBook 840",
    price: 1299.99,
    cpu: "Intel i7-1165G7",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "14in",
    image: "images/laptop.png"
  },
  {
    model: "Legion 5",
    price: 1599.99,
    cpu: "Ryzen 7 5800H",
    gpu: "RTX 3060",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "ThinkPad Carbon",
    price: 1799.99,
    cpu: "Intel i7-1260P",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "14in",
    image: "images/laptop.png"
  },
  {
    model: "ROG Strix G15",
    price: 2199.99,
    cpu: "Ryzen 9 5900HX",
    gpu: "RTX 3070",
    ram: "32GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "VivoBook 14",
    price: 699.99,
    cpu: "Intel i5-1135G7",
    gpu: "Intel Iris Xe",
    ram: "8GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "14in",
    image: "images/laptop.png"
  },
  {
    model: "Nitro 5",
    price: 1499.99,
    cpu: "Intel i7-11800H",
    gpu: "RTX 3060",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png"
  },
  {
    model: "MacBook Air M1",
    price: 999.99,
    cpu: "Apple M1",
    gpu: "Integrated",
    ram: "8GB",
    storage: "256GB",
    storageType: "SSD",
    screen: "13.3in",
    image: "images/laptop.png"
  }
];

const themeLink = document.getElementById("theme");

function toggleTheme() {

  if (themeLink.href.includes("css/light.css")) themeLink.href = "css/dark.css";
  else themeLink.href = "css/light.css";
}

var count = 0;

function add() {
  if(count==laptops.length) return;
  side = document.getElementById("side");

  let newItem = document.createElement("div");
  newItem.className = "inventoryItem";
  newItem.id = "item-" + count;

  side.appendChild(newItem);

  let img = document.createElement("img");
  img.className = "laptopImage";
  img.src = "images/laptop.png";

  let desc = document.createElement("p");
  desc.appendChild(document.createTextNode("Model: " + laptops[count].model));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("Price: $" + laptops[count].price));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("CPU: " + laptops[count].cpu));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("GPU: " + laptops[count].gpu));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("RAM: " + laptops[count].ram));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("Storage: " + laptops[count].storage));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("Storage Type: " + laptops[count].storageType));
  desc.appendChild(document.createElement("br"));

  desc.appendChild(document.createTextNode("Screen Size: " + laptops[count].screen));

  desc.className = "description";

  let del = document.createElement("button");
  del.className = "delete";

  del.onclick = function () {
    deleteItem(newItem.id);
  }

  let trash = document.createElement("img");
  trash.className = "trash";
  trash.src = "images/trash.svg";

  del.appendChild(trash);

  newItem.appendChild(img);
  newItem.appendChild(desc);
  newItem.appendChild(del);
  count++;
}


function deleteItem(id) {
  let item = document.getElementById(id);
  item.remove();
  count--;
}