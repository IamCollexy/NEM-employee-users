const Employee = require('./models/Employee');

const registerEmployeeController = async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    // Check if the employee already exists
    const existingEmployee = await Employee.findOne({
      firstname,
      lastname,
    }).exec();
    if (existingEmployee) {
      return res
        .status(409)
        .json({ error: 'Employee already exists' });
    }

    // Create a new employee
    const newEmployee = await Employee.create({
      firstname,
      lastname,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = registerEmployeeController;
