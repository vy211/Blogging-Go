const mongoose=require('mongoose');

async function db()
{
    try{

        await mongoose.connect(process.env.MONGO_URL);
        console.log('Db connected...');
    }catch(err)
    {
        console.log(err);
    }
}

module.exports=db;