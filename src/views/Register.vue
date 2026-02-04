<template>
  <div class="register-container">
    <h2>SmartClass Register</h2>

    <form @submit.prevent="register">
      <input v-model="fullname"    type="text" placeholder="Full name" required/>

      <input  v-model="username"  type="text" placeholder="Username" required/>

      <input v-model="password" type="password" placeholder="Password" required/>

      <button type="submit">Register</button>
    </form>

    <p v-if="success" class="success">สมัครสมาชิกสำเร็จ 🎉</p>


    <p v-if="error" class="error">{{ error }}</p>

    <p @click="router.push('/')" class="link">← กลับไป Login</p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const fullname = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)

const router = useRouter()

const register = async () => {
  error.value = ''
  success.value = false

  try {
    await axios.post(
      'https://smartclass-backend-xjoa.onrender.com/api/auth/register',
      {
        fullname: fullname.value,
        username: username.value,
        password: password.value
      }
    )

    success.value = true

    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (err) {
    error.value = 'Username นี้ถูกใช้งานแล้ว หรือข้อมูลไม่ถูกต้อง'
  }
}

const goLogin = () => {
  router.push('/')
}
</script>

<style scoped>
.register-container {
  max-width: 350px;
  margin: 80px auto;
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

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.back {
  margin-top: 15px;
  cursor: pointer;
  color: #007bff;
}

.link {
  cursor: pointer;
  color: #007bff;
}

</style>
