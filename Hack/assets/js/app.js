let userName = document.getElementById('username')
let emailEl = document.getElementById('email')
let passwordEl = document.getElementById('password')
let errorMsg = document.getElementById('error')
let storage = firebase.storage();
let auth = firebase.auth();
var db = firebase.firestore();
const LoginForm = document.querySelector('.login-form')
let usernumber = document.getElementById('usernumber')
let usercountry = document.getElementById('usercountry')
let userRole = document.getElementById('user-role') 
console.log(userRole)
let card = document.querySelector('#cards .row')
let loader = document.getElementById('loader');
console.log(card)
let cards = document.getElementById('cards')
let restaurantName = document.getElementById('restaurantName')
let price = document.getElementById('price')
let ItemName = document.getElementById('ItemName')
let category = document.getElementById('category')
let delivery = document.getElementById('delivery')
let nav = document.querySelector(".navbaar");
let randomId = Math.floor(Math.random() * 124903)
console.log(randomId)
async function Addproduct(){
  let id = randomId
  let url = await uploadImage(id)
  console.log(url)
  getProducts(id)
  await db.collection("products").doc().set({
    restaurantName : restaurantName.value,
    price : price.value,
    ItemName : ItemName.value,
    category : category.value,
    delivery : delivery.value,
    Id : randomId,
    image : url
})
.then(() => {
    console.log("Document successfully written!");
    restaurantName.value = '';
    price.value = '';
    ItemName.value = '';
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
}

function uploadImage(id){
  return new Promise(async (resolve,reject) => {
let file = document.getElementById('file')
let image = file.files[0]
let storageRef = storage.ref()
let imageRef = storageRef.child(`productimage/${id}/${image.name}`);
await imageRef.put(image)
let url = await imageRef.getDownloadURL();
resolve(url)
})}

function getProducts(){
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    loader.classList.add("d-none");
    loader.classList.add("w-0");
    loader.classList.add("p-0");
    const mainCardDetail = `
     <div class="col-lg-4 col-md-4 col-sm-12 pr-0 pl-0">
     <div class="cardsDiv">
         <img src="${doc.data().image}" alt="res-img"/> 
         <h5 class="card-title" id="title">Category: ${doc.data().ItemName}</h5>
         <h4 class="card-title" id="title">Restaurant: ${doc.data().restaurantName}</h4>
         <p id="ordMSG></p>
         <p style="color: green;" id="ordMsg"></p>
         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>
         <p id="Price">Rs : ${doc.data().price}</p>
         <a href="javascript:void(0)" class="orderBtn ${doc.id}" id="orderBtn" onclick="orderfunc(this)">Add To Cart</a>
         </div>
     </div>
    `
    card.innerHTML += mainCardDetail;
  
    });
});
}
getProducts();

async function register(){
   await firebase.auth().createUserWithEmailAndPassword(emailEl.value, passwordEl.value)
  .then(async(userCredential) => {
    // Signed in 
    var user = userCredential.user;
    let uid = user.uid
    console.log(user)
    errorMsg.innerText = 'Register Successfully'
    errorMsg.style.color='green'
    let obj = {
        username : userName.value,
        email : emailEl.value,
        password : passwordEl.value,
        uid : uid,
        phone : usernumber.value,
        country : usercountry.value,
        role : userRole.selected  
    }
    console.log(obj)
   await db.collection('users').doc(uid).set(obj)
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    errorMsg.innerText = errorMessage
    // ..
  });
}
let role;
function loginForm(){
  firebase.auth().signInWithEmailAndPassword(emailEl.value, passwordEl.value)
   .then((userCredential) => {
     // Signed in
     var user = userCredential.user;
     console.log(user.uid , '49')
     uid = user.uid
     let docRef = db.collection('users').doc(uid);
      docRef.get().then((doc) => {
        if (doc.exists) {
            let role = doc.data().role
            console.log("Document data:", doc.data(),role);
          if(role === true){
            window.location = 'restaurant.html'
          }
          else{
            window.location = 'home.html'
          }
          }})
    //  window.location = 'home.html'
     // ...
  })
   .catch((error) => {
     var errorCode = error.code;
     var errorMessage = error.message;
     errorMsg.innerHTML = errorMessage
   });
 
 }



let userEl = document.getElementById('user')
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      console.log(user)
      console.log(uid)
      let docRef = db.collection('users').doc(uid);
      docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            let usernameEl = doc.data().username;
            userEl.innerText = usernameEl
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
      
}})

function signout(){
    firebase.auth().signOut().then(() => {
        console.log('SignOut')
        window.location = 'login.html'
        // Sign-out successful.
      }).catch((error) => {
        errorMsg.innerText = error.message
      });
      
}


const showNav = () => {
    nav.classList.add("active");
}
const closeNav = () => {
    nav.classList.remove("active");
}


window.onscroll = function () {
  if (window.pageYOffset > 40) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};


function orderfunc(productId){
  let btnClass = productId.getAttribute("class");
  let splitId = btnClass.split("orderBtn ");
  let productCartId = splitId[1];
  console.log(productCartId);
}