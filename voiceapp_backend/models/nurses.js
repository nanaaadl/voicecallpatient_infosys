const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const NurseSchema = new mongoose.Schema({ 
    firstName: { type: String },
    lastName: { type: String },
    department: { type: String },
    role: { type: String },
    contactNumber: { type: String },
    licenseNumber: { type: String, unique: true },
    status: { type: String, default: 'Active' },
    pendingRequests: { type: Number, default: 0 },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

NurseSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

NurseSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const NurseModel = mongoose.model("nurses", NurseSchema);

module.exports = NurseModel;
