const mongoose=require('mongoose')

const db=mongoose.connect('mongodb+srv://rudrakshs:rudrakshs@jee.bymdn.mongodb.net/UserNames')
.then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{       
    console.error('MongoDB connection error:', err);        
    
})