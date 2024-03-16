<template>
    <v-sheet class="mx-auto" width="300" style="margin: 25px 0;">
        <v-form @submit.prevent>
        <v-text-field
            v-model="firstName"
            :rules="rules"
            label="Your Name"
        ></v-text-field>
        <v-text-field
            type="password"
            v-model="password"
            :rules="rules"
            label="Password"
        ></v-text-field>
        <v-btn class="mt-2" type="submit" block @click="login()">
            Login
            <span>
                <v-progress-circular
                    v-if="loading"
                    color="green"
                    indeterminate
                ></v-progress-circular>
            </span>
        </v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import api from '../utils/api.js';
  export default {
    data: () => ({
      firstName: '',
      rules: [
        value => {
          if (value) return true
          return 'You must enter a first name.';
        },
      ],
    }),

    methods: {
       async login() {
            this.loading=true;
            const response = api.save("std/login", {
                name: this.firstName,
                pwd: this.password,
            });
            if(response.status==200) {
                console.log("login successful");
            } else {
                console.log("login failed")
            }
            this.loading=false
        }
    }

  }
</script>