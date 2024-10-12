import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
});

const Bill = mongoose.models.Bill || mongoose.model('Bill', BillSchema);
export default Bill;
