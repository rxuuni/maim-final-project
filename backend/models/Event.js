import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String, // ممكن تخليه Date إذا بتخزن بصيغة ISO
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ticketPrice: {
      type: Number, // لو تبغاه رقم فقط خليه Number
      required: true,
    },
    seatAmount: {
      type: Number,
      required: true,
      default :50,
    },

    availableSeats: {
      type: Number,
      required: true,
      default:50
    },
    popularity: {
      type: String,
      enum: ["Low Popularity", "Medium Popularity", "High Popularity"], // تحكم بالقيم
    },
    expectedAttendance: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
      seatMap: {
    type: [[Number]], // 2D array for seat rows
    default: function() {
      // Default 6 rows, 7 seats each, all 0
      return Array(6).fill(null).map(() => Array(7).fill(0));
    }
  },

    status :{type: String
      , require: true , enum:["closed","upcoming","pending"], default: "upcoming"

    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
