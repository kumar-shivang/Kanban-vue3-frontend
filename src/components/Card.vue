<template>
  <div class="card" :class="textClass">
    <div class="card-header d-flex flex-row" v-show="!edit">
      <span
        v-if="!card.isComplete && !missedDeadline"
        class="bi bi-check-square text-danger check-icon"
        @click="markComplete"
      ></span>
      <span
        v-if="!card.isComplete && missedDeadline"
        class="bi bi-exclamation-square text-danger check-icon"
      >
      </span>
      <span
        v-if="card.isComplete"
        class="bi bi-check-square-fill text-success check-icon"
        @click="markIncomplete"
      ></span>

      <h5 class="card-title">
        {{ card.cardName }}
      </h5>
      <div class="dropdown">
        <i
          class="bi bi-three-dots dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></i>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#" @click="edit = true">Edit</a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="download"
              >Download as CSV</a
            >
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="deleteCard">Delete</a>
          </li>
          <li
            v-if="numberOfLists > 1"
            @mouseover="move = true"
            @mouseleave="move = false"
          >
            <a class="dropdown-item" href="#"
              >Move <span v-show="move">To</span>
              <ul v-show="move" class="moveCardMenu">
                <hr class="dropdown-divider" />
                <li
                  v-for="list in ListsObject"
                  :key="list.id"
                  @click="moveCard(list.id)"
                  class="moveCardMenuItem"
                >
                  {{ list.title }}
                </li>
              </ul></a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="card-body">
      <div class="alert alert-info" v-if="alert">{{ alert }}</div>
      <div class="card-text" v-if="!edit">{{ card.content }}</div>
      <div v-else>
        <card-edit-from :card="card" @closeEdit="edit = false"></card-edit-from>
      </div>
    </div>
    <div class="card-footer" v-show="!edit">
      <div v-if="!card.isComplete" class="card-subtitle">
        Deadline <span v-if="missedDeadline">missed</span>
        {{ card.deadline.fromNow() }}
      </div>
      <div v-else class="card-subtitle">
        Completed {{ card.completionDate.fromNow() }}
      </div>
    </div>
  </div>
</template>

<script>
import useStore from "../stores/counter.js";
import cardEditFrom from "./CardEditForm.vue";
import dayjs from "dayjs";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "CardView",
  data() {
    return {
      edit: false,
      move: false,
      alert: "",
    };
  },
  props: {
    card: {
      type: Object,
      required: true,
      today: dayjs().format("YYYY-MM-DD"),
    },
  },
  components: {
    cardEditFrom,
  },
  computed: {
    ListsObject() {
      let arr = [];
      for (let i = 0; i < this.store.userLists.length; i++) {
        let list = this.store.userLists[i];
        if (list.listID !== this.card.listID) {
          arr.push({ id: list.listID, title: list.title });
        }
      }
      return arr;
    },
    numberOfLists() {
      return this.store.userLists.length;
    },
    missedDeadline() {
      return dayjs(this.card.deadline).isBefore(dayjs());
    },
    textClass() {
      return {
        "text-danger": this.missedDeadline,
      };
    },
  },
  watch: {
    alert() {
      setTimeout(() => {
        this.alert = "";
      }, 3000);
    },
  },
  methods: {
    async markComplete() {
      await fetch("http://localhost:5000/card/markComplete", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          cardID: this.card.cardID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.store.updateCard(this.card.cardID, this.card.listID, data.card);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async markIncomplete() {
      await fetch("http://localhost:5000/card/markIncomplete", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          cardID: this.card.cardID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.store.updateCard(this.card.cardID, this.card.listID, data.card);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async moveCard(newListID) {
      await fetch("http://localhost:5000/card/move", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          cardID: this.card.cardID,
          new_listID: newListID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.store.moveCard(
            this.card.cardID,
            this.card.listID,
            newListID,
            data.card
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteCard() {
      await fetch("http://localhost:5000/card", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          cardID: this.card.cardID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.store.deleteCard(this.card.cardID, this.card.listID);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async exportCard() {
      return await fetch(
        "http://localhost:5000/export/card/" + this.card.cardID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.store.access_token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.alert = "Exporting card...";
          return data.taskID;
        })
        .catch((error) => {
          this.alert = "Error exporting card";
          console.log(error);
        });
    },
    async getStatus(taskID) {
      return await fetch("http://localhost:5000/export/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          taskID: taskID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data.status;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async download() {
      let taskID = await this.exportCard();
      console.log(taskID);
      if (taskID) {
        setTimeout(() => {
          let interval = setInterval(async () => {
            let status = await this.getStatus(taskID);
            console.log(status);
            if (status === "SUCCESS") {
              this.alert = "Download started";
              let a = document.createElement("a");
              a.href =
                "http://localhost:5000/export/download/card/" + this.card.cardID;
              a.click();
              clearInterval(interval);
            } else if (status === "FAILURE") {
              this.alert = "Download failed";
              clearInterval(interval);
            }
          }, 1000);
        }, 10000);
      } else {
        this.alert = "Error exporting card";
      }
    },
  },
};
</script>

<style scoped>
@import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

.card {
  width: 90%;
  margin: 4%;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  /*background-color: #fce8e8;*/
  min-height: 30%;
}
.card-subtitle {
  text-align: end;
}
.check-icon {
  padding-right: 5px;
  font-size: 20px;
}
.card-header {
  width: 100%;
}
.card-title {
  padding-right: 75%;
}
.dropdown-toggle {
  cursor: pointer;
}
.dropdown-toggle::after {
  display: none;
}
i {
  cursor: pointer;
  font-size: 125%;
}
.moveCardMenu {
  list-style: unset;
  padding: 0;
  margin: 0;
  text-align: center;
}
.dropdown{
  position: absolute;
  right: 3%;
}
</style>
