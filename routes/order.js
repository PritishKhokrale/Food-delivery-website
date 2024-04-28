require('dotenv').config();
const database=require("mongoose");
database.connect(process.env.MONGODB_URL);

const messageschema=new database.Schema({
    customer_username:{
        type:String,
        default:null
    },
    restaurant_username:{
            type:String,
            default:null
          },
         
          message_status:{
            type:String,
            default:'pending'
          },
          Address:{
            type:String,
            default:null
          },
          contact:{
            type:Number,
            default:null
          },
          order:{
            type:String,
            default:null
          },
          payment:{
            type:String,
            default:null
          }
        
});

module.exports=database.model("Message",messageschema);