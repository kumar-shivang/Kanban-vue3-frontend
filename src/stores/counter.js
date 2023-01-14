import { defineStore } from "pinia";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
    async getUser() {
      const response = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      });
      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
      } else {
        const error = await response.json();
        this.errorMsg = error.error;
      }
    },
    setToken(access_token) {
      this.token = access_token;
      document.cookie = "";
    },
    setUser(user) {
      this.userData.userID = user.userID;
      this.userData.username = user.username;
      this.userData.email = user.email;
      this.userData.userLists = [];
      for (let i = 0; i < user.lists.length; i++) {
        let l = user.lists[i];
        for (let j = 0; j < l.cards.length; j++) {
          let card = l.cards[j];
          card.deadline = dayjs(card.deadline);
          card.creationTime = dayjs(card.creationTime);
          if (card.isComplete) {
            card.completionDate = dayjs(card.completionDate);
          } else {
            card.completionDate = null;
          }
          if (card.lastEdited) {
            card.lastEdited = dayjs(card.lastEdited);
          } else {
            card.lastEdited = dayjs(card.creationTime);
          }
        }
        this.userData.userLists.push(l);
      }
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
      for (let i = 0; i < this.userData.userLists.length; i++) {
        if (this.userData.userLists[i].listID === listID) {
          this.userData.userLists[i].title = newName;
        }
      }
    },
    addList(list) {
      this.userData.userLists.push(list);
    },
    addCard(listID, card) {
      for (let i = 0; i < this.userData.userLists.length; i++) {
        if (this.userData.userLists[i].listID === listID) {
          card.completionDate = null;
          card.deadline = dayjs(card.deadline);
          card.creationTime = dayjs(card.creationTime);
          this.userData.userLists[i].cards.push(card);
        }
      }
    },
    updateCard(cardID, listID, newCard) {
      let cardList = this.userData.userLists.filter(
        (list) => list.listID === listID
      )[0];
      cardList.cards = cardList.cards.filter((card) => card.cardID !== cardID);
      if (newCard.isComplete) {
        newCard.completionDate = dayjs(newCard.completionDate);
      } else {
        newCard.completionDate = null;
      }
      // if (newCard.lastEdited) {
      //   newCard.lastEdited = dayjs(newCard.lastEdited);
      // } else {
      //   newCard.lastEdited = dayjs(newCard.creationTime);
      // }
      newCard.deadline = dayjs(newCard.deadline);
      newCard.creationTime = dayjs(newCard.creationTime);
      cardList.cards.push(newCard);
    },
    moveCards(oldListID, newListID) {
      let oldList = this.userData.userLists.filter(
        (list) => list.listID === oldListID
      )[0];
      let newList = this.userData.userLists.filter(
        (list) => list.listID === newListID
      )[0];
      for (let i = 0; i < oldList.cards.length; i++) {
        let current_card = oldList.cards[i];
        current_card.listID = newListID;
        newList.cards.push(current_card);
        oldList.cards.splice(0, 1);
      }
    },
    deleteCard(cardID, listID) {
      let cardList = this.userData.userLists.filter(
        (list) => list.listID === listID
      )[0];
      cardList.cards = cardList.cards.filter((card) => card.cardID !== cardID);
    },
    moveCard(cardID, oldListID, newListID, newCard) {
      this.deleteCard(cardID, oldListID);
      this.addCard(newListID, newCard);
    },
    listSummary(listID) {
      let list = this.userData.userLists.filter(
        (list) => list.listID === listID
      )[0];
      let total = list.cards.length;
      let completed = list.cards.filter((card) => card.isComplete).length;
      let incomplete = list.cards.filter((card) => !card.isComplete).length;
      let daySummary = {};
      for (let i = 0; i < list.cards.length; i++) {
        let card = list.cards[i];
        if (card.isComplete) {
          let date = card.completionDate.format("YYYY-MM-DD");
          if (!daySummary[date]) {
            daySummary[date] = {
              created: 0,
              completed: 0,
              missed: 0,
            };
          }
          daySummary[date].completed += 1;
        } else {
          let date = card.deadline.format("YYYY-MM-DD");
          if (!daySummary[date]) {
            daySummary[date] = {
              created: 0,
              completed: 0,
              missed: 0,
            };
          }
          daySummary[date].missed += 1;
        }
        let compDate = card.creationTime.format("YYYY-MM-DD");
        if (!daySummary[compDate]) {
          daySummary[compDate] = {
            created: 0,
            completed: 0,
            missed: 0,
          };
        } else {
          daySummary[compDate].created += 1;
        }
      }
      let xAxis = [];
      let createdCards = [];
      let missedCards = [];
      let completedCards = [];
      for (let date in daySummary) {
        xAxis.push(date);
        createdCards.push(daySummary[date].created);
        missedCards.push(daySummary[date].missed);
        completedCards.push(daySummary[date].completed);
      }
      return {
        total,
        completed,
        incomplete,
        xAxis,
        completedCards,
        missedCards,
        createdCards,
      };
    },
    userSummary() {
      let totalCards = 0;
      let totalLists = this.userData.userLists.length;
      let completedCards = 0;
      let deadlineMissed = 0;
      let currentlyActive = 0;
      for (let i = 0; i < this.userData.userLists.length; i++) {
        let list = this.userData.userLists[i];
        for (let j = 0; j < list.cards.length; j++) {
          let card = list.cards[j];
          totalCards++;
          if (card.isComplete) {
            completedCards++;
          } else {
            if (card.deadline.isBefore(dayjs())) {
              deadlineMissed++;
            } else {
              currentlyActive++;
            }
          }
        }
      }
      return {
        totalCards: totalCards,
        totalLists: totalLists,
        completedCards: completedCards,
        deadlineMissed: deadlineMissed,
        currentlyActive: currentlyActive,
      };
    },
  },
});

export default useCounterStore;
