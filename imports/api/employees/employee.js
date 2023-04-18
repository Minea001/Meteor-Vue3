import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Employees=new Mongo.Collection('employee')

Employees.schema=new SimpleSchema({
    name:String,
    telephone:{
        type:String,
        optional:true,
    },
    address:{
        type:String,
        optional:true
    },
    status:String
})
Employees.attachSchema(Employees.schema)

export default Employees