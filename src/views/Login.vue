<template>
  <div class="login-container">
    <h2>SmartClass Login</h2>

    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required/>

      <input v-model="password" type="password" placeholder="Password" required/>

      <button type="submit">Login</button>
    </form>

    <p @click="router.push('/register')" style="cursor:pointer;color:#007bff">สมัครสมาชิก</p>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''

  try {
    const res = await axios.post(
      'https://smartclass-backend-xjoa.onrender.com/api/auth/login',
      {
        username: username.value,
        password: password.value
      }
    )

    localStorage.setItem('token', res.data.token)
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Username หรือ Password ไม่ถูกต้อง'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 320px;
  margin: 100px auto;
  text-align: center;
}

input {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
}

button {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.link {
  cursor: pointer;
  color: #007bff;
}
</style>
