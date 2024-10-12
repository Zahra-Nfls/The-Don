    import mongoose, { Schema, model, models } from 'mongoose';

    const timeEntrySchema = new Schema({
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    });

    const TimeEntry = models.TimeEntry || model('TimeEntry', timeEntrySchema);

    export default TimeEntry;
