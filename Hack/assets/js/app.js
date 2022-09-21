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
let logo = document.getElementById("logo");
let ItemDesc = document.getElementById("ItemDesc");

async function Addproduct() {
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
    order: false,
    Id: uid,
    image: url,
    orderCount: 0,
    dateAdded: new Date(),
    orderFrom: []
  })
    .then(() => {
      console.log("Document successfully written!");
      floatMsg.classList.add("active");
      setTimeout(()=>{
        floatMsg.classList.remove("active");
      },3000)
      price.value = '';
      ItemName.value = '';
      ItemDesc.value = ''
    })
    .catch((error) => {
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
      const mainCardDetail = `
     <div class="col-lg-4 col-md-8 col-sm-12 pr-0 pl-0">
     <div class="cardsDiv">
         <img src="${doc.data().image}" alt="res-img"/> 
         <h5 class="card-title" id="title">Category: ${doc.data().category}</h5>
         <p class="card-text">Recipe: ${doc.data().ItemName}</p>         
         <h4 class="card-title" id="title">Restaurant: ${doc.data().restaurantName}</h4>
         <p id="ordMSG></p>
         <p style="color: green;" id="ordMsg"></p>
         <p class="card-text">${doc.data().ItemDesc? doc.data().ItemDesc : ""}</p>
         <p id="Price">Rs : ${doc.data().price}</p>
         <span id="dltError" style="color:green;text-align:center;text-transform:uppercase;padding-bottom: 20px;font-weight: 600;" class="d-none"></span>
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

async function register() {
  await firebase.auth().createUserWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then(async (userCredential) => {
      // Signed in 
      var user = userCredential.user;
      let uid = user.uid
      console.log(user)
      let Url2 = await uploadImageFunc(uid)
      errorMsg.innerText = 'Register Successfully'
      errorMsg.style.color = 'green'
      let obj = {
        username: userName.value,
        email: emailEl.value,
        password: passwordEl.value,
        uid: uid,
        phone: usernumber.value,
        country: usercountry.value,
        role: userRole.selected,
        userimage: Url2,
        userRestaurantName: userRestaurantName.value
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
function loginForm() {
  firebase.auth().signInWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then((userCredential) => {
      // Signed in
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
      var errorCode = error.code;
      var errorMessage = error.message;
      errorMsg.innerHTML = errorMessage
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


function orderfunc(productId) {
  let btnClass = productId.getAttribute("class");
  let splitId = btnClass.split("orderBtn ");
  productCartId.push(splitId[1]);
  console.log(productCartId);
  productId.innerHTML = `Added To Cart <i class="fa-solid fa-check"></i>`
}

function delfunc(productId) {
  let dltError = document.getElementById("dltError");
  let btnClass = productId.getAttribute("class");
  let splitId = btnClass.split("orderBtn ");
  let dltId = splitId[1];
  console.log(dltId);
  db.collection("products").doc(dltId).delete().then(() => {
    dltError.classList.remove("d-none");
    dltError.classList.add("d-block")
    dltError.innerHTML = "Deleted Successfully";
    getProducts();
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
  logo.src = avatarUrl;
  console.log(usernameLS);
  welcomeUser.innerHTML = `Hello, ${usernameLS}`;
