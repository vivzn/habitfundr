// models/User.js
import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: false },
    days: { type: [mongoose.Schema.Types.Mixed], required: false },
    emoji: { type: String, required: false },
    progress: { type: [mongoose.Schema.Types.Mixed], required: true }, // Array of any type
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    photoURL: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    refund: { type: String, required: true, unique: true },
    habits: [habitSchema], // Embed the habit schema in the user schema
    createdAt: { type: Date, default: Date.now },
    payed: { type: Boolean, default: Date.now },
});



// Export the User model
const User =  mongoose.models.User || mongoose.model("User", userSchema);
export default User;