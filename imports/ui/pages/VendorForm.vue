<template>
    <q-dialog no-esc-dismiss no-backdrop-dismiss v-model="visableDialog" @hide="$event => cancel">
        <q-card style="width:70%; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Vendor</div>
            </q-card-section>

            <q-card-section>
                <validate-form ref="refForm" :validation-schema="rules">
          <q-form @submit.prevent>
                <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
                    <div class="col-xs-12 col-md-6 col-lg-6">
                        <div class="row q-col-gutter-y-sm">
                            <div class="col-12">
                                <validation-field v-slot="{ value, field, errorMessage }" v-model="form.name" name="name">
                                    <q-input :model-value="value" outlined dense label="Name *" v-bind="field"
                                        :error="!!errorMessage" :error-message="errorMessage"></q-input>
                                </validation-field>       
                            </div>
                            <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.telephone"
                      name="telephone"
                    >
                      <q-input
                        :model-value="value"
                        label="Telephone"
                        :v-bind="field"
                        outlined
                        dense
                        required
                      ></q-input>
                    </validate-field>
                  </div>   
                </div>

              </div>
              
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.address"
                      name="address"
                    >
                      <q-input
                        :model-value="value"
                        label="Address"
                        outlined
                        dense
                        v-bind="field"
                        required
                      ></q-input>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.status"
                      name="status"
                    >
                      <span class="text-grey-9" style="padding-right: 8px">
                        Status
                      </span>

                      <q-option-group
                        :model-value="value"
                        :options="statusOpts"
                        color="primary"
                        v-bind="field"
                        inline
                        style="display: inline-block"
                      />
                    </validate-field>
                  </div>
                </div>
              </div>
              </div>
        </q-form>
        </validate-form>
      </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
                <div class="text-right q-gutter-sm">
                    <q-btn color="primary">Save</q-btn>
                    <q-btn color="red">Remove</q-btn>
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
import { useQuasar } from 'quasar';


const $q = useQuasar()
const props = defineProps({
    dialog: {
        type: Boolean,
        default: true,
    },
    showId: {
        type: String,
        default: null,
    }
})
const emit = defineEmits(['closed'])
// data properties
const refForm = ref()
const form = ref({
    name: '',
    telephone: '',
    address: '',
    status: 'active',
    date: ''
})
const visableDialog = ref(false)

const rules = {
    name: [
        (v) => !!v || 'Name is required',
        async (value) => {
            let selector = {
                name: value
            }
            if (props.showId) {
                selector._id = { $ne: props.showId }
            }
            const res = await checkExist(selector)
            return !res || 'Exist name'
        }
    ]
}
const checkExist = (selector) => {
    return new Promise((resolve, reject) => {
        Meteor.call('checkExist', { selector }, (err, res) => {
            if (err) {
                reject(err)
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
    Meteor.call('insertVendor', form.value, (err, res) => {
        if (err) {
            console.log(err)
            Notify.error({ message: err.reason || err })
        } else {
            Notify.success({ message: 'Success' })
            reset()
            cancel()
        }
    })
}
// update
const update = () => {
    Meteor.call('updateVendor', (res, err) => {
        if (err) {
            Notify.error({ message: err.reason || err })

        } else {
            Notify.success({ message: 'Success' })

        }
    }
    )
}
//remove
const remove = () => {
    $q.dialog({
        title: 'Confirm',
        message: 'Do you want to remove [${form.value.name}] ?',
        cancel: true,
        ok: {
            push: true,
        },
    }).onOk(() => {
        Meteor.call('removeVendor', { id: props.showId }, (err, res) => {
            if (err) {
                Notify.error({ message: err.reason || err })
            } else {
                Notify.success({ message: 'Success' })
                // Call method Cancel to close dialog
                cancel()
            }
        })
    })
}
// method reset 
const reset = () => {
    delete form.value._id
    refForm.value?.reset()
    form.value.status = 'active'
}
// for cancel
const cancel = () => {
    reset()
    emit('closed', false)
}
watch(
    () => props.dialog,
    (value) => {
        visableDialog.value = value
    }
)
watch(
    () => props.showId,
    (value) => {
        if (value) {
            Meteor.call('getVendorById', (err, res) => {
                form.value = res
            })
        }
    }
)
</script>