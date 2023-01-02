import { defineStore } from "pinia";

function get_cookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function delete_cookie(name) {
  if (get_cookie(name)) {
    document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

const useCounterStore = defineStore("counter", {
  state: () => ({
    token: get_cookie("access_token"),
    add_list: false,
    userData: {
      userID: null,
      username: "",
      userLists: [],
      email: "",
    },
  }),
  getters: {
    access_token: (state) => state.token,
    isLoggedIn: (state) => state.token !== "",
    username: (state) => state.userData.username,
    userID: (state) => state.userData.userID,
    userLists: (state) => state.userData.userLists,
    email: (state) => state.userData.email,
  },
  actions: {
    setToken(access_token) {
      this.token = access_token;
      document.cookie = "";
    },
    setUser(user) {
      this.userData.userID = user.userID;
      this.userData.username = user.username;
      this.userData.userLists = user.lists;
      this.userData.email = user.email;
    },
    logout() {
      this.token = "";
      delete_cookie("access_token");
    },
    removeList(listID) {
      this.userData.userLists = this.userData.userLists.filter(
        (list) => list.listID !== listID
      );
    },
    renameList(listID, newName) {
      // console.log("renameList funciton called");
      for (let i = 0; i < this.userData.userLists.length; i++) {
        // console.log(this.userData.userLists[i].title);
        if (this.userData.userLists[i].listID === listID) {
          // console.log("found list");
          this.userData.userLists[i].title = newName;
        }
      }
    },
  },
});

export default useCounterStore;
