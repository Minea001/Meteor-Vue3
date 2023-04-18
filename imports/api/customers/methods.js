import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import Customer from './customers'

export const insertCustomer1 = new ValidatedMethod({
  name: 'insertCustomer1',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
    }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false

    try {
      // return Customer.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert customer error', error)
    }
  },
})

Meteor.methods({
  ShowCustomer(){
    const doc=Customer.find().fetchAsync()
    return doc
},
  findCustomers({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)

    const data = Customer.aggregate([
      {
        $match: selector,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    const total = Customer.find(selector).count()
    return { data, total }
  },
  checkExist({selector}) {
    return Customer.findOne(selector)
  },
  getCustomerById(id) {
    return Customer.findOne({ _id: id })
  },
  insertCustomer(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      console.log('doc', doc)
      // Comsert1.insert(doc)
      return Customer.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert customer error', error)
    }
  },
  updateCustomer(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Customer.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update customer error', error)
    }
  },
  removeCustomer({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Customer.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove customer error', error)
    }
  },
})
