import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Vendors=new Mongo.Collection('vendors')
Vendors.schema=new SimpleSchema({
    name:String,
    telephone:{
        type: String,
        optional:true,
    },
    address:{
        type:String, 
        optional:true,
    },
    status:String

})
Vendors.attachSchema(Vendors.schema)

export default Vendors