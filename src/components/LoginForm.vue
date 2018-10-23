<template>
  <div class="loginDiv">
    <div class="formHeader">Log in to Kapiche</div>
    <div class="signupText">Don't have an account? <a class="link" href="">Sign up here</a></div>
    <div v-if="loginError" class="loginError">{{ loginErrorMessage }}</div>
    <form @submit.prevent="login" novalidate="true">
      <div class="input">
        <label for="">Email</label>
        <input type="email" name="email" v-model="email" />
      </div>
      <div class="input">
        <label for="">Password</label>
        <input type="password" name="password" v-model="password" />
      </div>
      <div class="container">
        <input type="submit" value="Log in"/>
      </div>
    </form>
    <div class="container">
      <a class="link" href="">Forgot password?</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      loginError: false,
      loginErrorMessage: ''
    }
  },
  methods: {
    login: function (event) {
      if (!this.email || !this.validEmail(this.email)) {
        this.loginErrorMessage = 'Please enter a valid email address.'
        this.loginError = true
        return
      }

      if (!this.password) {
        this.loginErrorMessage = 'Please enter a password.'
        this.loginError = true
        return
      }

      // This is meeting the requirement from the tooltip on the zelpin screen.
      if (this.password === 'incorrect') {
        this.loginErrorMessage = 'Email or password is incorrect.'
        this.loginError = true
        return
      }

      this.loginError = false
      this.$store.commit('authenticate', true)
      this.$router.push({name: 'nps'})
    },
    validEmail: function (email) {
      // Yikes.
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>

<style scoped>

.loginDiv {
  border: solid 1px #e6e6e6;
  background-color: #ffffff;

  justify-content: center;
  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  display: flex;
  flex-direction: column;

  box-shadow: 0px 1px 5px 0 rgba(0, 1, 1, 0.1);
  padding-left: 84px;
  padding-right: 84px;
  padding-top: 60px;
  padding-bottom: 60px;
}

.formHeader {
  text-align: center;
  font-family: "Lato";
  font-size: 40px;
  font-weight: 900;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.53;
  letter-spacing: normal;
  color: #383838;
}

.loginError {
  display: flex;
  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  width: 450px;
  height: 62px;
  border: solid 1px #ee3824;
  background-color: #fff3f3;
  justify-content: left;
  padding-left: 20px;
}

.signupText {
  padding-bottom: 20px;
}

form {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
}

form p {
  grid-column: 1 / 2;
}

input, label {
    display: block;
}
input {
  width: 450px;
  height: 47px;
  font-family: "Lato";
  font-size: 18px;
  font-weight: 400;
  border-radius: 5px;
  border: solid 1px #d8d8d8;
  background-color: #f9f9f9;
  margin: 0 auto;
  text-align: left;
  color: #383838;
  padding-left: 20px;
}
form label {
  font-family: "Lato";
  font-size: 18px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 26px;
  letter-spacing: normal;
  color: #383838;
  padding-top: 14px;
  padding-bottom: 14px;
}
input[type=submit] {
  width: 220px;
  height: 56px;
  border-radius: 5px;
  background-image: linear-gradient(to top, #0684c1, #1c96d1);
  margin-top: 45px;
  margin-bottom: 27px;
  font-size: 20px;
  text-shadow: 0px 1px 4px rgba(18, 63, 84, 0.25);
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  padding: 0px;
}

.link {
  font-size: 16px;
  color: #068ccc;
  text-decoration: none;
}
</style>
