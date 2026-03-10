export default {
    brand: import.meta.env.VITE_BRAND || "printing",
    api: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

theme:{
light:{
primary:"#505039",
secondary:"#A7AA63",
bg:"#EAE6D2",
text:"#121A1B"
},

dark:{
primary:"#A7AA63",
secondary:"#505039",
bg:"#121A1B",
text:"#EAE6D2"
}
}

}
