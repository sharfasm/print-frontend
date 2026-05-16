export default {
    brand: process.env.NEXT_PUBLIC_BRAND || "printing",
    api: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    backend: "http://localhost:5000",

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
