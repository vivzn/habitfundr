import mongoose from 'mongoose';


const reqSchema = new mongoose.Schema({
    email: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Req =  mongoose.models.Req || mongoose.model("Req", reqSchema);
export default Req;