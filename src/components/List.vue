<template>
  <div class="list-group">
    <div class="list-group-item-heading d-inline-flex flex-row">
      <h4 v-if="!edit">{{ list_name }}</h4>
      <form v-if="edit" class="form-control" @submit="rename">
        <input
          type="text"
          v-model="new_list_name"
          placeholder="Rename the list"
        />
        <input type="submit" value="Rename" class="btn btn-primary" />
        <span class="btn btn-close" @click="cancelRename"></span>
      </form>
      <div class="buttons d-inline-flex flex-row" v-if="!edit">
        <span class="bi bi-plus-square" @click="createCard = true"></span>
        <span class="dropstart g-col-2">
          <div
            class="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots"></i>
          </div>
          <ul class="dropdown-menu">
            <li>
              <a
                class="dropdown-item"
                @mouseover="confirm = true"
                @mouseleave="confirm = false"
              >
                Delete
                <div class="card card-body" v-if="confirm">
                  <p>Are you sure?</p>
                  <button
                    class="btn btn-primary btn-sm mb-2"
                    @click="deleteList(this.listID)"
                  >
                    Yes
                  </button>
                  <button
                    class="btn btn-danger btn-sm mb-2"
                    @click="confirm = false"
                  >
                    No
                  </button>
                </div>
              </a>
            </li>

            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click="edit = !edit">Rename</a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li
              v-if="numberOfLists > 1 && numberOfCards > 0"
              @mouseover="moveCardsMenu = true"
              @mouseleave="moveCardsMenu = false"
            >
              Move All Cards <span v-show="moveCardsMenu">To</span>
              <ul v-show="moveCardsMenu" class="moveCardMenu">
                <li
                  v-for="list in ListsObject"
                  :key="list.id"
                  @click="moveCards(list.id)"
                  class="moveCardMenuItem"
                >
                  {{ list.title }}
                </li>
              </ul>
            </li>
            <hr class="dropdown-divider" />
            <li @click="download">Download as CSV</li>
          </ul>
        </span>
      </div>
    </div>
    <template class="list-group-item">
      <div v-if="alert" class="alert alert-light">
        {{ alert }}
      </div>
      <card-creation-from
        v-if="createCard"
        :listID="listID"
        @cancel="createCard = false"
      />
      <slot></slot>
    </template>
  </div>
</template>

<script>
import useStore from "@/stores/counter.js";
import cardCreationFrom from "@/components/cardCreationFrom.vue";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "ListView",
  data() {
    return {
      edit: false,
      URL: "http://127.0.0.1:5000/list",
      new_list_name: "",
      moveCardsMenu: false,
      confirm: false,
      createCard: false,
      alert: "",
    };
  },
  components: { cardCreationFrom },
  props: {
    list_name: {
      type: String,
      required: true,
    },
    listID: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ListsObject() {
      let arr = [];
      for (let i = 0; i < this.store.userLists.length; i++) {
        let list = this.store.userLists[i];
        if (list.listID !== this.listID) {
          arr.push({ id: list.listID, title: list.title });
        }
      }
      return arr;
    },
    numberOfLists() {
      return this.store.userLists.length;
    },
    numberOfCards() {
      let list = this.store.userLists.filter(
        (list) => list.listID === this.listID
      )[0];
      return list.cards.length;
    },
  },
  watch: {
    alert() {
      setTimeout(() => {
        this.alert = "";
      }, 2000);
    },
  },
  methods: {
    cancel() {
      console.log("canceled in list");
      this.createCard = false;
    },
    async deleteList(listID) {
      console.log("delete list");
      console.log(listID);
      console.log(this.URL);
      const response = await fetch(this.URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.store.access_token,
        },
        body: JSON.stringify({
          listID: listID,
          access_token: this.store.access_token,
        }),
      });
      if (response.ok) {
        console.warn("list deleted");
        this.store.removeList(listID);
      }
    },
    async rename() {
      this.edit = false;
      await fetch(this.URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.store.access_token,
        },
        body: JSON.stringify({
          listID: this.listID,
          new_title: this.new_list_name,
          access_token: this.store.access_token,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.warn("list renamed");
            this.store.renameList(this.listID, this.new_list_name);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelRename() {
      this.edit = false;
      this.new_list_name = "";
    },
    async moveCards(id) {
      await fetch(this.URL + "/movecards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.store.access_token,
        },
        body: JSON.stringify({
          listID: this.listID,
          newListID: id,
          access_token: this.store.access_token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.store.moveCards(this.listID, id);
        })
        .catch((error) => console.log(error));
    },
    async triggerExport() {
      return await fetch("http://127.0.0.1:5000/export/list/" + this.listID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.store.access_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.alert = data.message;
          return data.taskID;
        })
        .catch((error) => {
          console.log(error);
          this.alert = "Something went wrong";
        });
    },
    async getTaskStatus(taskID) {
      return await fetch("http://127.0.0.1:5000/export/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + this.store.access_token,
        },
        body: JSON.stringify({
          taskID: taskID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.alert = "Checking status";
          return data.status;
        })
        .catch((error) => {
          console.log(error);
          this.alert = "Something went wrong";
        });
    },
    async download() {
      let taskID = await this.triggerExport();
      console.log(taskID);
      setTimeout(() => {
        let interval = setInterval(async () => {
          let status = await this.getTaskStatus(taskID);
          console.log(status);
          if (status === "SUCCESS") {
            this.alert = "Download started";
            let a = document.createElement("a");
            a.href =
              "http://127.0.0.1:5000/export/download/list/" + this.listID;
            a.click();
            clearInterval(interval);
          } else if (status === "FAILURE") {
            clearInterval(interval);
            this.alert = "Something went wrong";
          }
        }, 1000);
      }, 10000);
      console.log(taskID);
    },
  },
};
</script>

<style scoped>
@import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

.list-group {
  width: 25vw;
  height: 85vh;
  overflow: scroll;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  margin: 1rem;
  min-width: 275px;
}

.list-group-item-heading {
  color: darkslategrey;
  padding: 0;
  position: sticky;
  top: 0;
  text-transform: capitalize;
  font-size: 2rem;
  z-index: 1;
  width: 100%;
  align-self: center;
  background-color: #b3f0ff;
  border-radius: 5%;
  margin-bottom: 1rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  max-height: 15%;
}
.list-group-item {
  padding: 0;
  /*background-color: #f;*/
}

h4 {
  padding: 5px 50% 5px 5px;
  margin: 5px;
  align-self: center;
  display: inline-block;
}
i {
  color: darkslategray;
  font-size: 1.5rem;
  padding: 5px;
  margin: 5px;
}
.dropdown-menu {
  text-align: center;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
.dropdown-toggle::before {
  display: none;
}

a {
  text-decoration: none;
}

.moveCardMenu {
  list-style: unset;
  padding: 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
}
.moveCardMenuItem {
  margin: 1%;
  padding: 1%;
  cursor: pointer;
}
.moveCardMenuItem:hover {
  background-color: #b3f0ff;
  border-radius: 5%;
}
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  position: absolute;
  right : 5%;
}
</style>
