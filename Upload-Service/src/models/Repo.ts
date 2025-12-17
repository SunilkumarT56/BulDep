import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
    repoUrl : {
        type : String,
        required : true
    },
    repoId : {
        type : String,
        required : true
    },
    
}, {
    timestamps : true
})


const Repo = mongoose.model("Repo", repoSchema)

export default Repo;