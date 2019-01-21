// var obj = {};

// var x = 100;

// obj['first'] = x;
// obj['second'] = "Hello";
// console.log(obj);

// function test (field){
//   field = "testing";

// }

// console.log(obj)
// console.log(test('phone'));


var contacts = [
  {
    name: "Laurel",
    phone: "123 456 7890",
    email: "laurel@comics.com",
    friends: ["Hardy", "Abbott", "Costello"]
  },
  {
    name: "Hardy",
    phone: "321 654 0987",
    email: "hardy@hardyharhar.com",
    friends: ["Laurel", "Buster"]
  },
  {
    name: "Buster",
    phone: "987 654 3210",
    email: "buster@keaton.ca",
    friends: ["Hardy"]
  },
  {
    name: "Abbott",
    phone: "888 123 4567",
    email: "abbott@whosonfirst.co",
    friends: ["Costello", "Laurel"]
  },
  {
    name: "Costello",
    phone: "767 676 7676",
    email: "costello@imonfirst.co",
    friends: ["Abbott", "Laurel"]
  }
];

/* You should be changing this code */

function findFriend(data, name, field) {
  var friend;
  var contactDetail;
  var newObjContact = {};
  var contactFormat;
  var counter = 0;
  for (var x = 0; x < contacts.length; x++) {
    if (name === contacts[x].name) {
      friend = contacts[x].friends[0];
      // return friend
    }
    counter++;
    // console.log(counter);
    if (counter > contacts.length - 1) {
      if (name !== contacts[x].name || field !== contacts[x].field) {
      return "Not Found";
    }
  }
  }

  for (var i = 0; i < contacts.length; i++) {
    if (friend === contacts[i].name) {
      contactDetail = contacts[i][field];
      for (var k in contacts[i]) {
        if (contactDetail === contacts[i][k]) {
          contactFormat = k;
        }
      }
    }
  }
  newObjContact['name'] = friend;
  newObjContact[contactFormat] = contactDetail;

  console.log(newObjContact);
}

findFriend(contacts, "hello", "phone")
findFriend(contacts, "Buster", "email")
findFriend(contacts, "Buster", "Happy Bday")
