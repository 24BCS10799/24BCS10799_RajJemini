const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://vivekshah6755_db_user:SvDxJY0vVmP24CLo@cluster0.onxapmu.mongodb.net/fs601B", {
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({msg:"Hello World!"});
});

const Registration = mongoose.model("Registration", {
  studentName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in)$/
  },
  rollNumber: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z0-9]{8,10}$/
  },
  eventType: {
    type: String,
    required: true,
    enum: ["CODING_HACKATHON", "AI_WORKSHOP", "ROBOTICS", "GAMING"]
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  finalAmount: Number,
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING"
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

app.post("/api/registrations", async (req, res) => {
  try {
    if (req.body.eventType === "AI_WORKSHOP" && req.body.teamSize !== 1) {
      return res.status(400).json({error:"AI Workshop only permits individual registrations"});
    }

    let amount = req.body.ticketPrice;

    if (req.body.discountCode === "CAMPUS50") {
      amount = req.body.ticketPrice / 2;
    }
    else if (req.body.discountCode === "EARLYBIRD") {
      amount = req.body.ticketPrice - 100;
      if (amount < 0) {
        amount = 0;
      }
    }
    else if (req.body.discountCode) {
      return res.status(400).json({error:"Invalid discount code"});
    }

    req.body.finalAmount = amount;

    const registration = await Registration.create(req.body);

    res.status(201).json(registration);
  }
  catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({error:"This email is already registered for the event"});
    }
    res.status(400).json({error:err.message});
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    let data;

    if (req.query.eventType) {
      data = await Registration.find({eventType:req.query.eventType});
    }
    else if (req.query.status) {
      data = await Registration.find({status:req.query.status});
    }
    else {
      data = await Registration.find();
    }

    res.json(data);
  }
  catch (err) {
    res.status(500).json({error:err.message});
  }
});

app.get("/api/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({error:"Invalid registration ID format"});
    }

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({error:"Registration not found"});
    }

    res.json(registration);
  }
  catch (err) {
    res.status(500).json({error:err.message});
  }
});

app.put("/api/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({error:"Invalid registration ID format"});
    }

    const old = await Registration.findById(req.params.id);

    if (!old) {
      return res.status(404).json({error:"Registration not found"});
    }

    let event = req.body.eventType || old.eventType;
    let team = req.body.teamSize || old.teamSize;
    let price = req.body.ticketPrice || old.ticketPrice;
    let discount = req.body.discountCode;

    if (discount === undefined) {
      discount = old.discountCode;
    }

    if (event === "AI_WORKSHOP" && team !== 1) {
      return res.status(400).json({error:"AI Workshop only permits individual registrations"});
    }

    let amount = price;

    if (discount === "CAMPUS50") {
      amount = price / 2;
    }
    else if (discount === "EARLYBIRD") {
      amount = price - 100;
      if (amount < 0) {
        amount = 0;
      }
    }
    else if (discount) {
      return res.status(400).json({error:"Invalid discount code"});
    }

    req.body.finalAmount = amount;

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true,runValidators:true}
    );

    res.json(registration);
  }
  catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({error:"This email is already registered for the event"});
    }

    res.status(400).json({error:err.message});
  }
});

app.delete("/api/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({error:"Invalid registration ID format"});
    }

    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({error:"Registration not found"});
    }

    res.json({message:"Registration deleted successfully"});
  }
  catch (err) {
    res.status(500).json({error:err.message});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
