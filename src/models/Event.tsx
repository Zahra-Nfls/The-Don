import mongoose from 'mongoose';

// Define the event schema
const eventSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },  // Keeping times as strings in 'HH:mm' format
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    hourSalary: { type: Number, required: true },
    effectiveHours: { type: Number } // Make effectiveHours optional
});

// Middleware to calculate effective hours before saving the event
eventSchema.pre('save', function (next) {
    const event = this as any;

    // Convert startTime and endTime from 'HH:mm' to total minutes
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    // Calculate the effective hours worked
    const totalMinutesWorked = endInMinutes - startInMinutes;
    const effectiveHours = totalMinutesWorked / 60;

    event.effectiveHours = effectiveHours; // Store the calculated effective hours

    next();
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
