import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Categorys=new Mongo.Collection('categorys');

Categorys.schema=new SimpleSchema({
    name:String
})

Categorys.attachSchema(Categorys.schema)

export default Categorys