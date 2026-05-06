const mongoose = require("mongoose");

const chemistryJeeMainsSchema = new mongoose.Schema({
  question_id: { type: String, required: true, unique: true },
  subject: { type: String, default: "chemistry" },
  chapter: {
    type: String,
    required: true,
    enum: [
      "alcohols-phenols-and-ethers",
      "aldehydes-ketones-and-carboxylic-acids",
      "basics-of-organic-chemistry",
      "biomolecules",
      "chemical-bonding-and-molecular-structure",
      "chemical-equilibrium",
      "chemical-kinetics-and-nuclear-chemistry",
      "chemistry-in-everyday-life",
      "compounds-containing-nitrogen",
      "coordination-compounds",
      "d-and-f-block-elements",
      "electrochemistry",
      "environmental-chemistry",
      "gaseous-state",
      "haloalkanes-and-haloarenes",
      "hydrocarbons",
      "hydrogen",
      "ionic-equilibrium",
      "isolation-of-elements",
      "p-block-elements",
      "periodic-table-and-periodicity",
      "polymers",
      "practical-organic-chemistry",
      "redox-reactions",
      "s-block-elements",
      "solid-state",
      "solutions",
      "some-basic-concepts-of-chemistry",
      "structure-of-atom",
      "surface-chemistry",
      "thermodynamics",
    ],
  },
  topic: String,
  question: { type: String, required: true },
  options: [
    {
      identifier: String,
      content: String,
    },
  ],
  correct_option: [String], // Array to support multiple-choice if needed
  solution: String,
  paper_id: String,
  question_type: { type: String, default: "mcq" },
});

module.exports = mongoose.model("chemistryJeeMains", chemistryJeeMainsSchema);
