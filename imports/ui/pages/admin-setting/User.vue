<template>
  <q-card>
    <q-card-section>
      <q-table
        v-model:pagination="pagination"
        title="User"
        :rows="dataTable"
        :columns="columns"
        row-key="_id"
        :filter="filter"
      >
        <template #top>
          <div class="q-gutter-x-md">
            <q-btn color="primary" no-caps @click="addNew"> Add New </q-btn>
          </div>

          <q-space />

          <q-input
            v-model="filter"
            borderless
            dense
            debounce="300"
            placeholder="Search"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body-cell-username="props">
          <q-td :props="props">
            <span class="ra-text-link" @click="edit(props.row)">
              {{ props.row.username }}
            </span>
          </q-td>
        </template>

        <template #body-cell-fullName="props">
          <q-td :props="props">
            <span>
              {{ props.row.profile.fullName }}
            </span>
          </q-td>
        </template>

        <template #body-cell-email="props">
          <q-td :props="props">
            <span>
              {{ props.row.emails[0].address }}
            </span>
          </q-td>
        </template>

        <template #body-cell-allowedBranches="props">
          <q-td :props="props">
            <span>
              {{ formatBranches(props.row.allowedBranchDocs) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-roleGroup="props">
          <q-td :props="props">
            <span>
              {{ props.row.profile.roleGroup }}
            </span>
          </q-td>
        </template>

        <template #body-cell-expiryDay="props">
          <q-td :props="props">
            <span>
              {{ props.row.profile.expiryDay }}
              ({{ formatDate(props.row.profile.expiryDate) }})
            </span>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <span>
              {{ props.row.profile.status }}
            </span>
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Component -->
    <Component
      :is="currentModal"
      v-model="visibleModal"
      :show-id="showId"
      @closed="handleModelClose"
    />
  </q-card>
</template>
<script setup>
import { ref, defineAsyncComponent, nextTick, onMounted, shallowRef } from 'vue'
import moment from 'moment'
import Notify from '../../lib/notify.js'
// const UserForm = shallowRef(
//   defineAsyncComponent(() => import('./UserForm.vue'))
// )

import UserForm from './UserForm.vue'

// Composables
import useMethod from '../../composables/useMethod'

// State
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})

const filter = ref('')
const columns = ref([
  {
    name: 'username',
    label: 'Username',
    align: 'left',
    field: 'username',
    sortable: true,
  },
  {
    name: 'fullName',
    align: 'left',
    label: 'Full Name',
    field: 'profile.fullName',
    sortable: true,
  },
  { name: 'email', label: 'Email', align: 'left', field: 'emails' },

  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'profile.status',
  },
])

const dataTable = ref([])

// Form
const currentModal = shallowRef(null)
const visibleModal = ref(false)
const showId = ref(null)

const getDataTable = () => {
  const { call } = useMethod('app.findUsers')
  call({
    selector: { username: { $ne: 'super' } },
    options: { sort: { 'profile.fullName': 1 } },
  })
    .then((result) => {
      dataTable.value = result
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
      dataTable.value = []
    })
}

const addNew = () => {
  visibleModal.value = true
  nextTick(() => {
    currentModal.value = UserForm.value
  })
}

const edit = (row) => {
  showId.value = row._id
  visibleModal.value = true
  nextTick(() => {
    currentModal.value = UserForm.value
  })
}

const formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY')
}

const formatBranches = (branches) => {
  let content = ''
  branches.forEach((branch, index) => {
    content += `${branch.code}: ${branch.name} `

    if (index + 1 < branches.length) {
      content += ','
    }
  })

  return content
}

const handleModelClose = () => {
  visibleModal.value = false
  nextTick(() => {
    showId.value = null
    currentModal.value = null

    getDataTable()
  })
}

onMounted(() => {
  getDataTable()
})
</script>
