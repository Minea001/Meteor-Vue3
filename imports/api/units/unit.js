import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
 
const Unit=new Mongo.Collection('unit')

Unit.schema=new SimpleSchema({
    name:String
})
Unit.attachSchema(Unit.schema)

export default Unit