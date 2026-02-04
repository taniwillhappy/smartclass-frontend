<template>
  <div class="dashboard">
    <h2>Dashboard</h2>

    <!-- ข้อมูลคุณครู -->
    <p v-if="user">ยินดีต้อนรับคุณครู <strong>{{ user.fullname }}</strong></p>
    <div class="top-actions">
      <!-- <button @click="openProfileEdit">แก้ไขข้อมูลคุณครู</button> -->
      <button class="logout" @click="logout">Logout</button>
    </div>
    <hr/>

    <!--  MODAL แก้ไขโปรไฟล์  -->
    <div v-if="showProfileModal" class="modal-backdrop">
      <div class="modal">
        <h3>แก้ไขข้อมูลคุณครู</h3>

        <input v-model="editProfile.fullname" placeholder="ชื่อ-นามสกุล"/>

        <input v-model="editProfile.password" type="password" placeholder="Password ใหม่ (ไม่แก้ให้เว้นว่าง)"/>

        <div class="modal-actions">
          <button @click="saveProfile">บันทึก</button>
          <button class="cancel" @click="closeProfileEdit">ยกเลิก</button>
        </div>
      </div>
    </div>
  
    <!-- ฟอร์มเพิ่มนักเรียน -->
    <h3>เพิ่มรายชื่อนักเรียน</h3>
    <div class="form">


     <input v-model.number="newStudent.number" type="number" placeholder="เลขที่"/>
     
      <select v-model="newStudent.prefix">
        <option disabled value="">คำนำหน้า</option>
        <option>นาย</option>
        <option>นาง</option>
        <option>นางสาว</option>
        <option>เด็กชาย</option>
        <option>เด็กหญิง</option>
      </select>

      <input v-model="newStudent.name" type="text" placeholder="ชื่อนักเรียน"/>

      <select v-model="newStudent.department">
        <option value="" disabled>เลือกแผนก</option>
        <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
        <option value="คอมพิวเตอร์ธุรกิจ">คอมพิวเตอร์ธุรกิจ</option>
        <option value="การบัญชี">การบัญชี</option>
        <option value="ช่างยนต์">ช่างยนต์</option>
        <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
      </select>

      <select v-model="newStudent.level">
        <option value="" disabled>เลือกชั้น</option>
        <option value="ปวช.1/1">ปวช.1/1</option>
        <option value="ปวช.1/2">ปวช.1/2</option>
        <option value="ปวช.2/1">ปวช.2/1</option>
        <option value="ปวช.2/2">ปวช.2/2</option>
        <option value="ปวช.3/1">ปวช.3/1</option>
        <option value="ปวช.3/2">ปวช.3/2</option>
        <option value="ปวส.1/1">ปวส.1/1</option>
        <option value="ปวส.1/2">ปวส.1/2</option>
        <option value="ปวส.2/1">ปวส.2/1</option>
        <option value="ปวส.2/2">ปวส.2/2</option>
      </select>


      <button @click="addStudent">เพิ่ม</button>

    </div>

    <!-- ฟอร์ม Filters -->
    <h3>หมวดหมู่</h3>
    <div class="filters">
      <select v-model="selectedDepartment">
        <option value="">ทุกแผนก</option>
        <option v-for="d in departments" :key="d" :value="d">
          {{ d }}
        </option>
      </select>

      <select v-model="selectedLevel">
        <option value="">ทุกชั้น</option>
        <option value="ปวช.1/1">ปวช.1/1</option>
        <option value="ปวช.1/2">ปวช.1/2</option>
        <option value="ปวช.2/1">ปวช.2/1</option>
        <option value="ปวช.2/2">ปวช.2/2</option>
        <option value="ปวช.3/1">ปวช.3/1</option>
        <option value="ปวช.3/2">ปวช.3/2</option>
        <option value="ปวส.1/1">ปวส.1/1</option>
        <option value="ปวส.1/2">ปวส.1/2</option>
        <option value="ปวส.2/1">ปวส.2/1</option>
        <option value="ปวส.2/2">ปวส.2/2</option>
      </select>
    </div>


    <!-- ตารางนักเรียน -->
    <table>
      <thead>
        <tr>
          <th>เลขที่</th>
          <th>คำนำหน้า</th>
          <th>ชื่อนักเรียน</th>
          <th>แผนกวิชา</th>
          <th>ระดับชั้น</th> 
          <th>จัดการ</th>
        </tr>
      </thead>

  <tbody>
  <tr v-for="student in paginatedStudents" :key="student.id">

    <!-- เลขที่ -->
    <td>
      <input v-if="editingId === student.id" v-model.number="student.number" type="number"/>
      <span v-else>{{ student.number }}</span>
    </td>

    <!-- คำนำหน้า -->
    <td>
    <select v-if="editingId === student.id" v-model="student.prefix">
        <option>นาย</option>
        <option>นาง</option>
        <option>นางสาว</option>
        <option>เด็กชาย</option>
        <option>เด็กหญิง</option>
    </select>
    <span v-else>{{ student.prefix }}</span>
    </td>

    <!-- ชื่อ -->
    <td>
      <input v-if="editingId === student.id" v-model="student.name"/>
      <span v-else>{{ student.name }}</span>
    </td>

   
       <!-- แผนกวิชา  -->
        <td>
        <select v-if="editingId === student.id" v-model="student.department">
            <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
            <option value="คอมพิวเตอร์ธุรกิจ">คอมพิวเตอร์ธุรกิจ</option>
            <option value="การบัญชี">การบัญชี</option>
            <option value="ช่างยนต์">ช่างยนต์</option>
            <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
        </select>
        <span v-else>{{ student.department }}</span>
        </td>

     <!-- ชั้น -->
    <td>
      <select v-if="editingId === student.id" v-model="student.level">
        <option value="ปวช.1/1">ปวช.1/1</option>
        <option value="ปวช.1/2">ปวช.1/2</option>
        <option value="ปวช.2/1">ปวช.2/1</option>
        <option value="ปวช.2/2">ปวช.2/2</option>
        <option value="ปวช.3/1">ปวช.3/1</option>
        <option value="ปวช.3/2">ปวช.3/2</option>
        <option value="ปวส.1/1">ปวส.1/1</option>
        <option value="ปวส.1/2">ปวส.1/2</option>
        <option value="ปวส.2/1">ปวส.2/1</option>
        <option value="ปวส.2/2">ปวส.2/2</option>
      </select>

      <span v-else>{{ student.level }}</span>
    </td>


    <!-- จัดการ -->
    <td>
      <button v-if="editingId !== student.id" @click="startEdit(student)">แก้ไข</button>

      <button v-else @click="saveEdit(student)">บันทึก</button>

      <button class="delete" @click="removeStudent(student.id)" :disabled="editingId === student.id">ลบ</button>
    </td>
  </tr>

  <!-- empty table -->
  <tr v-if="students.length === 0">
    <td colspan="7" class="empty">ยังไม่มีรายชื่อนักเรียน</td> 
  </tr>                                                                               
    </tbody>
   </table>


   <!-- ปุ่มเปลี่ยนหน้า (หน้า 1 / 2 / 3 …) -->
  <div class="pagination" v-if="totalPages > 1"><br><center>
    <button :disabled="currentPage === 1" @click="currentPage--">◀</button>
    <span>หน้า {{ currentPage }} / {{ totalPages }}</span>

    <button :disabled="currentPage === totalPages" @click="currentPage++">▶</button>
  </center>
  </div>

  </div>
</template>





<!-- js  -->


<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()


const user = ref(null)
const students = ref([])
const editingId = ref(null)
const selectedDepartment = ref('')
const selectedLevel = ref('')
const showProfileModal = ref(false)

const currentPage = ref(1)
const pageSize = 10


const newStudent = ref({
  number: '',
  prefix: '',
  name: '',
  level: '',
  department: ''
})

const filter = ref({
  department: '',
  level: '',
  prefix: ''
})

const editProfile = ref({
  fullname: '',
  password: ''
})

const sortBy = ref('numberAsc')

  
const token = localStorage.getItem('token')

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

/* ---------- auth ---------- */
const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

/* ---------- load ---------- */
const loadStudents = async () => {
  const res = await axios.get(
    'https://smartclass-backend-xjoa.onrender.com/api/students',
    { headers: getHeaders() }
  )
  students.value = res.data
}

onMounted(async () => {
  if (!token) return logout()

  try {
    const res = await axios.get(
      'https://smartclass-backend-xjoa.onrender.com/api/auth/dashboard',
      { headers: getHeaders() }
    )
    user.value = res.data.user

    await loadStudents() 
  } catch {
    logout()
  }
})


/* ---------- add ---------- */
const addStudent = async () => {
  if (
    !newStudent.value.number ||
    !newStudent.value.prefix ||
    !newStudent.value.name ||
    !newStudent.value.level ||
    !newStudent.value.department
  ) {
    alert('กรุณากรอกข้อมูลให้ครบ')
    return
  }

   if (isDuplicateNumber(newStudent.value.number)) {
    alert('เลขที่ซ้ำในห้อง')
    return
  }

  await axios.post(
    'https://smartclass-backend-xjoa.onrender.com/api/students',
    newStudent.value,
    { headers }
  )

  newStudent.value = {
    number: '',
    prefix: '',
    name: '',
    level: '',
    department: ''
  }

  loadStudents()
}




/* ---------- edit ---------- */
const startEdit = (student) => {
  editingId.value = student.id
}

const saveEdit = async (student) => {
  await axios.put(
    `https://smartclass-backend-xjoa.onrender.com/api/students/${student.id}`,
    {
      number: student.number,
      prefix: student.prefix,
      name: student.name,
      level: student.level,
      department: student.department
    },
    { headers }
  )

  editingId.value = null
}


/* ---------- delete ---------- */
const removeStudent = async (id) => {
  if (!confirm('ลบรายชื่อนี้?')) return

  await axios.delete(
    `https://smartclass-backend-xjoa.onrender.com/api/students/${id}`,
    { headers }
  )

  students.value = students.value.filter(s => s.id !== id)
}


const isDuplicateNumber = (num) => {
  return students.value.some(
    s =>
      Number(s.number) === Number(num) &&
      s.level === newStudent.value.level
  )
}



/* ดึงรายชื่อแผนกจากข้อมูลจริง */
const departments = computed(() => {
  return [...new Set(students.value.map(s => s.department))]
})


/* ---------- watch ---------- */
watch([selectedDepartment, selectedLevel], () => {
  currentPage.value = 1
})


// กรองเฉพาะ “แสดง / ไม่แสดง”
const visibleStudents = computed(() => {
  let result = [...students.value]

  if (selectedDepartment.value) {
    result = result.filter(
      s => s.department === selectedDepartment.value
    )
  }

  if (selectedLevel.value) {
    result = result.filter(
      s => s.level === selectedLevel.value
    )
  }

  return result
})

// Pagination (10 คน / หน้า)
const totalPages = computed(() => {
  return Math.ceil(visibleStudents.value.length / pageSize)
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return visibleStudents.value.slice(start, start + pageSize)
})

// ---------edit teacher---------
const openProfileEdit = () => {
  editProfile.value = {
    fullname: user.value.fullname,
    password: ''
  }
  showProfileModal.value = true
}

const closeProfileEdit = () => {
  showProfileModal.value = false
}

const saveProfile = async () => {
  if (!editProfile.value.fullname) {
    alert('กรุณากรอกชื่อ-นามสกุล')
    return
  }

  await axios.put(
    'https://smartclass-backend-xjoa.onrender.com/api/auth/update-profile',
    {
      fullname: editProfile.value.fullname,
      password: editProfile.value.password || undefined
    },
    { headers }
  )

  alert('แก้ไขข้อมูลเรียบร้อย กรุณาเข้าสู่ระบบใหม่')

  // logout + กลับหน้า login
  localStorage.removeItem('token')
  router.push('/')
}

</script>




<!-- css  -->

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 40px auto;
}

.logout {
  margin-bottom: 20px;
}

hr {
  margin: 30px 0;
}

/* form */
.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input,
select {
  padding: 8px;
}

button {
  padding: 8px 14px;
  cursor: pointer;
}

/* table */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

th {
  background: #f0f0f0;
}

.delete {
  background: #e74c3c;
  color: white;
  border: none;
}

.empty {
  color: #777;
}

input, select {
  width: 90%;
}

button {
  margin: 0 3px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.attendance {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn {
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  opacity: 0.4;
}


.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters select {
  padding: 6px;
}

.top-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  width: 320px;
  border-radius: 6px;
}

.modal input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

.modal input:disabled {
  background: #f0f0f0;
  color: #555;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel {
  background: #ccc;
}

</style>
