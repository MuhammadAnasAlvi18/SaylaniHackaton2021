let userName = document.getElementById('username')
let emailEl = document.getElementById('email')
let passwordEl = document.getElementById('password')
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
let loaderh1 = document.getElementById('loaderh1');
console.log(card)
let cards = document.getElementById('cards')
let restaurantName = document.getElementById('restaurantName')
let price = document.getElementById('price')
let ItemName = document.getElementById('ItemName')
let category = document.getElementById('category')
let delivery = document.getElementById('delivery')
let nav = document.querySelector(".navbaar");
let userDetail = document.querySelector(".userDetail");
let productCartId = [];
let uid;
let avatarImg = document.getElementById("avatarImg");
let userRestaurantName = document.getElementById("userRestaurantName");
let bannerh1 = document.querySelector(".banner h1");
let bannerSpan = document.getElementById("bannerSpan");
let floatMsg = document.getElementById("floatMsg");
let ItemDesc = document.getElementById("ItemDesc");
let DeliveryDIVspan = document.querySelector(".DeliveryDIV span");
let addFav = document.querySelectorAll(".buyCards .fa-heart");
let rowGet = document.querySelector(".rowGet");
let buyLoader = document.getElementById("buyLoader");

async function Addproduct() {
  DeliveryDIVspan.classList.remove("d-none");
  let id = uid
  let url = await uploadImage(id)
  console.log(url)
  getProducts();
  await db.collection("products").doc().set({
    restaurantName: restaurantName.value,
    price: price.value,
    ItemName: ItemName.value,
    ItemDesc : ItemDesc.value,
    category: category.value,
    Id: uid,
    image: url,
    orderCount: 0,
    time : new Date().getTime(),
    orderFrom: []
  })
    .then(() => {
      console.log("Document successfully written!");
      floatMsg.classList.add("active");
      DeliveryDIVspan.classList.add("d-none");
      setTimeout(()=>{
        floatMsg.classList.remove("active");
      },3000)
      price.value = '';
      ItemName.value = '';
      ItemDesc.value = '',
      url = ""
    })
    .catch((error) => {
      DeliveryDIVspan.classList.add("d-none");
      console.error("Error writing document: ", error);
    });
}

function uploadImage(id) {
  return new Promise(async (resolve, reject) => {
    let file = document.getElementById('file')
    let image = file.files[0]
    let storageRef = storage.ref()
    let imageRef = storageRef.child(`productimage/${id}/${image.name}`);
    await imageRef.put(image)
    let url = await imageRef.getDownloadURL();
    resolve(url)
  })
}

function getProducts() {
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      if (doc.data().Id === uid) {
        loader.classList.add("d-none");
        loader.classList.add("w-0");
        loader.classList.add("p-0");
        let dated = doc.data().time;
        let Cdate = new Date().getTime();
        let finalDate = Cdate - dated;
        let days = Math.floor(finalDate / (1000 * 3600 * 24));
        let hours = Math.floor(finalDate/1000/60/60); 
        let minutes = Math.floor((finalDate/1000)/60); 
        let seconds = Math.floor((finalDate/1000)); 
        let day = days < 2 ? "day" : "days";
        let hour = hours < 2 ? "hour" : "hours";
        let min = minutes < 2 ? "minute" : "minutes";
        let sec = seconds < 2 ? "second" : "seconds";

        console.log(hour , min , sec , day);

      const mainCardDetail = `
     <div class="col-lg-4 col-md-8 col-sm-12 mb-5">
     <div class="cardsDiv">
         <img src="${doc.data().image}" alt="res-img"/>
         <div class="uploadCat">
         ${hours === 0 ? `${seconds < 60 ? `${seconds < 30 ? `<span class='pr-2'>Uploaded: Just Now </span>` : `<span class='pr-2'>Uploaded: ${seconds} ${sec} ago </span>`}` : `<span class='pr-2'>Uploaded: ${minutes} ${min} ago </span>`}` : `${hours > 24 ? `<span class='pr-2'>Uploaded: ${days} ${day} ago </span>` : `<span class='pr-2'>Uploaded: ${hours} ${hour} ago </span>`}`}
         <span>Category: ${doc.data().category}</span>
         </div>
         <div class="uploadCat pb-5">
         <span>Restaurant: ${doc.data().restaurantName}</span>
         <span>Price : ${doc.data().price} Rs</span>
         </div>
         <h4 class='cardH4'>${doc.data().ItemName}</h4> 
         <p id="ordMSG></p>
         <p style="color: green;" id="ordMsg"></p>
         <p class="card-text card-para">${doc.data().ItemDesc? doc.data().ItemDesc : ""} </p>
         <a href="javascript:void(0)" class="orderBtn ${doc.id}" id="orderBtn" onclick="delfunc(this)">Delete <i class="fa-solid fa-trash"></i></a>
         <!-- <a href="javascript:void(0)" class="orderBtn ${doc.id}" id="orderBtn" onclick="orderfunc(this)">Add To Cart <i class="fa-solid fa-plus"></i></a> -->
         </div>
     </div>
    `
        card.innerHTML += mainCardDetail;
    }

    });
  });
}
getProducts();


function getAllproducts(){
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      buyLoader.classList.add("d-none");
      console.log(doc.id, " => ", doc.data());
      const mainCardDetails = `
      <div class="col-lg-4 col-md-6 mb-4">
      <div class="buyCards">
          <i class="fa-regular fa-heart"></i>
          <div class="moreRes"><span>more from this restaurant</span></div>
          <img src="${doc.data().image}" alt="card-img">
          <div class="BuycardSec">
              <span>Restaurant : ${doc.data().restaurantName}</span>
              <span>Reviews : 50+</span>
          </div>
          <h3>${doc.data().ItemName}</h3>
          <h4>${doc.data().category}</h4>
          <h5 class="price">Price : ${doc.data().price} Rs</h5>
          <div class="plusMinus"><a href="javascript:void(0)">-</a><input type="text" value="0" readonly><a href="javascript:void(0)">+</a></div>
          <div class="addtoCartAnchorDiv"><a href="javascript:void(0)" class="addToCartAnchor ${doc.id}" onclick="orderfunc(this)">Add to Cart</a></div>
      </div>
  </div>
    `
    rowGet.innerHTML += mainCardDetails;
    
    });
  });
}

getAllproducts()

async function register() {
  let signupbtn = document.querySelector(".signup-btn");
  signupbtn.classList.add("active");
  await firebase.auth().createUserWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then(async (userCredential) => {
      setTimeout(()=>{signupbtn.classList.remove("active");},2000)
      // Signed in '
      var user = userCredential.user;
      let uid = user.uid
      console.log(user)
      let Url2 = await uploadImageFunc(uid)
      let obj = {
        username: userName.value,
        email: emailEl.value,
        password: passwordEl.value,
        uid: uid,
        phone: usernumber.value,
        city: usercountry.value,
        role: userRole.selected,
        userimage: Url2,
        userRestaurantName: userRestaurantName.value,
        joined: new Date().getTime(),
        orderCompleted: 0,
        myCart:[]
      }
      console.log(obj)
      await db.collection('users').doc(uid).set(obj)
      userName.value = "";
      emailEl.value = "";
      passwordEl.value = "";
      usernumber.value = "";
      usercountry.value = ""
      // ...
    })
    .catch((error) => {
      setTimeout(()=>{signupbtn.classList.remove("active");},2000)
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
}
let role;
function loginForm() {
  let loginbtn = document.querySelector(".login-btn");
  loginbtn.classList.add("active");
  firebase.auth().signInWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then((userCredential) => {
      // Signed in
      setTimeout(()=>{loginbtn.classList.remove("active");},2000)
      var user = userCredential.user;
      console.log(user.uid, '49')
      uid = user.uid
      let docRef = db.collection('users').doc(uid);
      docRef.get().then((doc) => {
        if (doc.exists) {
          let role = doc.data().role
          console.log("Document data:", doc.data(), role);
          if (role === true) {
            window.location = 'restaurant.html'
          }
          else {
            window.location = 'home.html'
          }
        }
      })
      //  window.location = 'home.html'
      // ...
    })
    .catch((error) => {
      setTimeout(()=>{loginbtn.classList.remove("active");},2000)
      var errorCode = error.code;
      var errorMessage = error.message;
    });

}



let userEl = document.getElementById('user')
let welcomeUser = document.getElementById("welcomeUser");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    uid = user.uid;
    console.log(user)
    console.log(uid)
    let docRef = db.collection('users').doc(uid);
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        localStorage.setItem("resName", doc.data().userRestaurantName);
        localStorage.setItem("avatar", doc.data().userimage);
        localStorage.setItem("username", doc.data().username);
        restaurantName.value = doc.data().userRestaurantName;
        let usernameEl = doc.data().username;
        userEl.innerText = usernameEl
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });


  }
})

function signout() {
  localStorage.removeItem("avatar");
  localStorage.removeItem("username");
  localStorage.removeItem("resName");
  localStorage.clear();
  firebase.auth().signOut().then(() => {
    console.log('SignOut')
    window.location = 'login.html'
    // Sign-out successful.
  }).catch((error) => {
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


function orderfunc(productId) {
  let btnClass = productId.getAttribute("class");
  let splitId = btnClass.split("addToCartAnchor ");
  productCartId.push(splitId[1]);
  console.log(productCartId);
  productId.innerHTML = `Added To Cart <i class="fa-solid fa-check"></i>`

  let uniq = [...new Set(productCartId)];
  console.log(uniq);

  db.collection("users").doc(uid).update({
    myCart : [...uniq]
  } , { merge: true })

  //   db.collection("products").doc("5XIue8r9Z7LdbeqH9at8").update({
  //   orderCount: 10
  // } , { merge: true });
}

function delfunc(productId) {
  let del_popup = document.getElementById("del_popup");
  del_popup.classList.add("active")
  let btnClass = productId.getAttribute("class");
  let splitId = btnClass.split("orderBtn ");
  let dltId = splitId[1];
  console.log(dltId);
  db.collection("products").doc(dltId).delete().then(() => {
    setTimeout(()=>{
      del_popup.classList.remove("active")
    },2000)
    setTimeout(()=>{window.location.reload()},3000)
}).catch((error) => {
  dltError.innerHTML = error;
  dltError.style.color = "red";
});

}

function showUser() {
  userDetail.classList.toggle("d-block");
}

function cart() {
  //   db.collection("users").doc(uid).set({
  //     cartId: productCartId
  // })

  console.log("CART CLICKED");

}

function uploadImageFunc(id) {
  return new Promise(async (resolve, reject) => {
    let file2 = document.getElementById('file2')
    let image = file2.files[0]
    let storageRef = storage.ref()
    let imageRef = storageRef.child(`userimage/${id}/${image.name}`);
    await imageRef.put(image)
    let url = await imageRef.getDownloadURL();
    resolve(url)
  })
}


  let avatarUrl = localStorage.getItem("avatar");
  let usernameLS = localStorage.getItem("username");
  let resName = localStorage.getItem("resName");
  // bannerh1.innerHTML = `Welcome, `;
  bannerSpan.innerHTML = usernameLS;
  avatarImg.src = avatarUrl;
  console.log(usernameLS);
  welcomeUser.innerHTML = `Hello, ${usernameLS}`;
  