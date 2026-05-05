const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Personal Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },

    // Academic Details
    enrollmentNumber: {
        type: String,
        required: [true, 'Enrollment number is required'],
        unique: true,
        uppercase: true
    },
    course: {
        type: String,
        required: [true, 'Course name is required'],
        enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'BBA', 'MBA']
    },
    branch: {
        type: String,
        required: [true, 'Branch/Department is required']
    },
    currentSemester: {
        type: Number,
        required: true,
        min: [1, 'Semester cannot be less than 1'],
        max: [10, 'Semester cannot be more than 10']
    },
    admissionYear: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    cgpa: {
        type: Number,
        min: [0, 'CGPA cannot be negative'],
        max: [10, 'CGPA cannot exceed 10'],
        default: 0
    },

    // Status & Metadata
    status: {
        type: String,
        enum: ['Active', 'Alumni', 'Suspended', 'Dropped'],
        default: 'Active'
    },
    profileImage: {
        type: String, // URL to the image
        default: 'https://via.placeholder.com/150'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Full Name
studentSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Indexing for faster searches
studentSchema.index({ enrollmentNumber: 1, email: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
