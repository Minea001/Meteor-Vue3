<template>
    <q-dialog v-model="visibleDialog" no-esc-dismiss no-backdrop-dismiss @hide="cancel">
        <q-card style="width: 70%; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Employee</div>
            </q-card-section>

            <q-card-section>
        <q-form ref="refForm">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-input
                v-model="form.name"
                :rules="rules.name"
                label="Name *"
              ></q-input>

              <q-input
                v-model="form.telephone"
                label="Telephone"
                required
              ></q-input>
            </div>
            <div class="col">
              <q-input
                v-model="form.address"
                label="Address"
                required
              ></q-input>
              <div label="Status">
                <fieldset>
            
                  <q-radio
                    v-model="form.status"
                    label="Active"
                    val="active"
                  ></q-radio>
                  <q-radio
                    v-model="form.status"
                    label="Inactive"
                    val="inactive"
                  ></q-radio>
                </fieldset>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
<div class="text-right q-gutter-sm">
    <q-btn color="primary" @click="submit">Save</q-btn>
    <q-btn v-if="showId" color="warning" @click="remove">Remove</q-btn>
    <q-btn outline color="primary" @click="cancel">Cancel</q-btn>
</div>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  name: 'ComA',
}
</script>
<script setup>
import Notify from '/imports/ui/lib/notify'
import { ref, watch } from 'vue'
import {useQuasar } from 'quasar'

const $q = useQuasar()
const props = defineProps({
    dialog: {
        type: Boolean,
        default: true,
    },
    showId: {
        type: String,
        default: null,
    },
})
const emit = defineEmits(['closed'])

// const initForm = {
//     name: '',
//     address: '',
//     telephone: '',
//     status: 'active',
// }
// const statusOpts = [
//     { label: 'Active', value: 'active' },
//     { label: 'Inactive', value: 'inactive' },
// ]
//dataproperties
const refForm = ref()
const form = ref({   
    name: '',
    address: '',
    telephone: '',
    status: 'active'})
const visibleDialog = ref(false)

// const rules = object({
//     name: string()
//         .min(4)
//         .test('exist', 'Name is required', (value) => {
//             if (!value) return true

//             let selector = {
//                 name: value,
//             }
//             if (props.showId) {
//                 selector._id = { $ne: props.showId }
//             }
//             return checkExist(selector)
//                 .then((res) => {
//                     return !res
//                 })
//                 .catch(() => false)
//         }),
// })
const rules = {
  name: [
    (v) => !!v || 'Name is required',
    async (value) => {
      let selector = {
        // name: {
        //   // $regex: new RegExp('^' + value.replace(/%/g, '.*') + '$', 'i'),
        //   $regex: new RegExp(value, 'i'),
        // },
        name: value,
      }
      if (props.showId) {
        selector._id = { $ne: props.showId }
      }

      const res = await checkExist(selector)
      return !res || 'Exist name'
    },
  ],
}

const checkExist = (selector) => {
    return new Promise((resolve, reject) => {
        Meteor.call('checkempExist', { selector }, (err, res) => {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(res)
            }
        })
    })
}
const submit = async () => {
  const valid = await refForm.value.validate()

  if (valid) {
    if (form.value._id) {
      update()
    } else {
      insert()
    }
  }
}
const insert = () => {
    Meteor.call('insertEmployees', form.value, (err, res) => {
        if (err) {
            console.log(err)
           Notify.error({ message: err.reason || err })          
        } else {
            console.log(res)
            Notify.success({ message: 'Success' })          
            cancel()
        }
    })
}

const update = () => {
    Meteor.call('updateEmployee', form.value, (err, res) => {
        if (err) {
            Notify.error({ message: err.reason || err })
        } else {
            Notify.success({ message: 'Update Success' })          
            cancel()
        }
    })
}
const remove=() => {
    $q.dialog({
        title: 'Comfirm',
        message: `Do you want to remove [${form.value.name}]?`,
        cancel: true,
        ok: {
            push: true
        },

    }).onOk(() => {
        Meteor.call('removeEmployee', { id: props.showId }, (err, res) => {
            if (err) {
                Notify.error({ message: err.reason || err })
            } else {
                Notify.success({ message: 'Deleted Success' })
                cancel()
            }

        })
    })
}
const reset = () => {
    delete form.value._id
   form.value=({
    name: '',
    address: '',
    telephone: '',
    status: 'active'
   })
}
const cancel = () => {
    reset()
    emit('closed', false)
}
watch(
    () => props.dialog,
    (value) => {
        visibleDialog.value = value
    }
)
watch(
    () => props.showId,
    (value) => {
        if (value) {
            Meteor.call('getEmployeeById', value, (err, res) => {
                form.value = res
            })
        }
    }
)

</script>