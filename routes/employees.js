const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const upload = require('../middlewares/multer'); 


router.post('/add', upload.single('f_Image'), async (req, res) => {
  try {
    const { f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_Createdate } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).send({ error: "Image is required" });
    }

   
    const newEmployee = new Employee({
      f_Id,
      f_Image: image.buffer, 
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course,
      f_Createdate: f_Createdate || Date.now(),
    });

    await newEmployee.save();
    res.status(201).send({ message: "Employee added successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/employees', async (req, res) => {
  const { sortBy = 'f_Id', order = 'asc' } = req.query; 
  const validSortFields = ['f_Id', 'f_Name', 'f_Email', 'f_Createdate']; 

  try {
    
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const employees = await Employee.find({}).sort({ [sortBy]: sortOrder });
    const employeesWithBase64Images = employees.map((emp) => ({
      ...emp._doc,
      f_Image: emp.f_Image ? `data:image/jpeg;base64,${emp.f_Image.toString('base64')}` : null, // Convert to Base64
    }));
    res.status(200).json(employeesWithBase64Images); 
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});




// Delete employee by ID
router.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.deleteOne({ f_Id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error.message);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});


// Update employee by ID
router.put('/employees/:id', upload.single('f_Image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log('ID:', id); // Log the ID
    console.log('Updated Data:', updatedData); // Log the data

    if (req.file) {
      updatedData.f_Image = req.file.buffer;
    }

    const employee = await Employee.findOneAndUpdate({ f_Id: id }, updatedData, {
      new: true, // Return the updated document
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error.message);
    res.status(500).json({ message: 'Failed to update employee' });
  }
});


module.exports = router;
