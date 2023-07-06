// Using Employee json model
// const data = {
//   employees: require('../model/employees.json'),
//   setEmployees: function (data) {
//     this.employees = data;
//   },
// };

// Using Employee Model
const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
  // Using Employee json model
  // res.json(data.employees);
  // Using Employee Model
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: 'No employees found' });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  // Using Employee json model

  // Check if the data array exists and has at least one employee
  // const id =
  //   data.employees && data.employees.length
  //     ? data.employees[data.employees.length - 1].id + 1
  //     : 1;

  // Use a library or a more robust method to generate unique IDs
  // const generatedId = generateUniqueId(); // Example using a library
  // const newEmployee = {
  //   id: id,
  //   firstname: req.body.firstname, // Make sure to validate and sanitize input
  //   lastname: req.body.lastname, // Make sure to validate and sanitize input
  // };

  // if (!newEmployee.firstname || !newEmployee.lastname) {
  //   return res
  //     .status(400)
  //     .json({ message: 'First and Last names are required' });
  // }

  // Add the new employee to the data array or store it in a database

  //    data.setEmployees([...data.employees, newEmployee]);
  //    res.status(201).json(data.employees);
  //  };

  // Using Employee model
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: 'First and Last names are required' });
  }
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (e) {
    console.error(e);
  }
};

const updateEmployee = async (req, res) => {
  // Using Employee json model
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // );

  // Using Employee Model
  if (!req?.body?.id) {
    return res
      .status(400)
      .json({ message: 'ID parameter is required.' });
  }
  const employee = await Employee.findOne({
    _id: req.body.id,
  }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  // Using Employee json model
  // const filteredArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // );
  // const unsortedArray = [...filteredArray, employee];
  // data.setEmployees(
  //   unsortedArray.sort((a, b) =>
  //     a.id > b.id ? 1 : a.id < b.id ? -1 : 0
  //   )
  // );
  // res.json(data.employees);

  // Using Employee model
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  // Using Employee json model
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} not found` });
  // }
  // const filteredArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // );
  // data.setEmployees([...filteredArray]);
  // res.json({ id: data.employees });

  // Using Employee Model
  if (!req?.body?.id) {
    return res
      .status(400)
      .json({ message: 'ID parameter is required.' });
  }

  const employee = await Employee.findOne({
    _id: req.body.id,
  }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.deleteOne({
    _id: req.body.id,
  });
  res.json(result);
};

const getEmployee = async (req, res) => {
  // Using Employee json model
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} not found` });
  // }

  // Using Employee Model
  if (!req?.params?.id) {
    return res
      .status(400)
      .json({ message: 'ID parameter is required.' });
  }
  const employee = await Employee.findOne({
    _id: req.params.id,
  }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
