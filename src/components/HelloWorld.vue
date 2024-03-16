<template>
  <v-container>

    <v-app-bar>
      <router-link to="/login" style="margin-left: 25px; text-decoration: none; color: #000">Login</router-link>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="students"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.pwd"
                        label="Password"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6">
                      <v-radio-group v-model="editedItem.gender">
                        <v-radio label="Male" value="male"></v-radio>
                        <v-radio label="Female" value="female"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-select v-model="editedItem.major"
                        label="Select"
                        :items="['IT', 'English', 'Frontend', 'Backend', 'Fullstack']"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6">
                      <v-date-picker></v-date-picker>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>

    <v-text-field label="Enter ID for search" v-model="search_id"></v-text-field>
    <v-btn @click="search()">Search</v-btn>

  </v-container>
</template>

<script>
import api from '@/utils/api'

  export default {
    name: "HelloWorld",

    data: () => ({
      search_id: '',
      loading: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'Id',
          align: 'start',
          sortable: false,
          key: 'id',
          value: 'id'
        },
        { title: 'Name', key: 'name', value: 'name' },
        { title: 'Gender', key: 'gender', value: 'gender' },
        { title: 'Major', key: 'major', value: 'major' },
        { title: 'Date of Birth', key: 'dob', value: 'dob' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      students: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        gender: 0,
        major: 0,
        dob: 0,
        pwd: '',
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        const response = await api.get("std/")
        if(response) {
          const data = await response.json();
          this.students = data;
        }
      },

      editItem (item) {
        this.editedIndex = this.students.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.students.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.students.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      // save () {
      //   if (this.editedIndex > -1) {
      //     Object.assign(this.students[this.editedIndex], this.editedItem)
      //   } else {
      //     this.students.push(this.editedItem)
      //   }
      //   this.close()
      // },

        async save() {
          console.log(this.editedItem.name, this.editedItem.gender);
          const response = await api.save("std/save", {
            name: this.editedItem.name,
            gender: this.editedItem.gender,
            major: this.editedItem.major,
            pwd: this.editedItem.pwd,
          });
          if(response.status==201) {
            this.initialize();
          } else {
            console.log("Something wrong")
          }
          this.close();
        },
        async search() {
          const response = await api.get(`std/${this.search_id}`); // std/{id}
          if(response.status==200) {
            const data = await response.json();
            console.log(data);
            alert(data.name + " ( " + data.major + " )");
          } else {
            this.$router.push({path:'/error'})
          }
        }
    },
  }
</script>
