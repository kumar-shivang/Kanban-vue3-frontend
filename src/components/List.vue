<template>
  <div class="list-group">
    <div class="list-group-item-heading">
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
      <div class="dropstart">
        <div
          class="dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-three-dots"></i>
        </div>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#" @click="deleteList(listID)"
              >Delete</a
            >
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="edit = !edit">Edit</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="list-group-item">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import useStore from "@/stores/counter.js";
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
    };
  },
  components: {},
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
  computed: {},
  watch: {},
  methods: {
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
      const response = await fetch(this.URL, {
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
      });
      if (response.ok) {
        // console.log("list renamed from server");
        this.store.renameList(this.listID, this.new_list_name);
        // console.log("list renamed finally");
      }
    },
    cancelRename() {
      this.edit = false;
      this.new_list_name = "";
    },
  },
};
</script>

<style scoped>
@import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

.list-group {
  width: 30vw;
  height: 85vh;
  overflow: scroll;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  background-color: #fce8e8;
  border-radius: 3%;
  margin-top: 1rem;
  min-width: 300px;
}

.list-group-item-heading {
  color: darkslategrey;
  padding: 0;
  position: sticky;
  text-transform: capitalize;
  font-size: 2rem;
  z-index: 1;
  width: 100%;
  align-self: center;
  background-color: wheat;
  border-radius: 5%;
  margin-bottom: 1rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.list-group-item {
  padding: 0;
  background-color: #fce8e8;
}

h4 {
  padding: 5px;
  margin: 5px;
  align-self: center;
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
</style>
