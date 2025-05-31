const Pet = require('../models/Pet');

exports.createPet = async (req, res) => {
  try {
    const { name, breed, gender, age, address } = req.body;
    const owner = req.user.id;

    const image = req.file ? req.file.filename : null;

    const pet = new Pet({ owner, name, breed, gender, age, address, image });
    await pet.save();

    res.status(201).json({ message: "Pet added successfully", pet });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('owner', 'name');
    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      console.log(`Pet not found: ID ${req.params.id}`);
      return res.status(404).json({ message: "Pet not found" });
    }

    console.log('Pet owner:', pet.owner);
    console.log('Authenticated user ID:', req.user.id);
    const ownerId = pet.owner._id ? pet.owner._id.toString() : pet.owner.toString();

    if (ownerId !== req.user.id) {
      console.log(`Authorization failed. Pet owner ID: ${ownerId}, User ID: ${req.user.id}`);
      return res.status(403).json({ message: "Not authorized" });
    }
    await pet.deleteOne();

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

