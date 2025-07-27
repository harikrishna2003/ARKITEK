import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './date-picker.css';
import axios from 'axios';

const AddLeave = ({ isOpen, onClose, onAdd, existing }) => {
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    role: '',
    startDate: null,
    endDate: null,
    remarks: '',
  });

  const [search, setSearch] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      axios.get("http://localhost:3000/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => setAllEmployees(res.data))
      .catch(err => console.error("Error loading employees:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (existing) {
      setForm({
        employeeId: existing.employeeId || '',
        name: existing.name || '',
        role: existing.role || '',
        startDate: existing.rawStart || null,
        endDate: existing.rawEnd || null,
        remarks: existing.remark || '',
      });
    } else {
      setForm({
        employeeId: '',
        name: '',
        role: '',
        startDate: null,
        endDate: null,
        remarks: '',
      });
    }
  }, [existing]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = allEmployees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEmployees(filtered.slice(0, 5));
  };

  const handleSelectEmployee = (emp) => {
    setForm({
      ...form,
      employeeId: emp._id,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.jobProfile,
    });
    setSearch('');
    setFilteredEmployees([]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, name, role, startDate, endDate, remarks } = form;

    if (!employeeId || !name || !role || !startDate || !endDate) {
      alert('Please select an employee and fill all fields.');
      return;
    }

    const data = { employeeId, name, role, startDate, endDate, remarks };

    try {
      const token = localStorage.getItem("token");
      if (existing) {
        await axios.put(`http://localhost:3000/leaves/${existing.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert("Leave updated successfully!");
      } else {
        await axios.post("http://localhost:3000/leaves", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert("Leave created successfully!");
      }

      onClose();
      setForm({
        employeeId: '',
        name: '',
        role: '',
        startDate: null,
        endDate: null,
        remarks: '',
      });
      window.location.reload(); // optional
    } catch (error) {
      alert("Failed to submit leave. Please try again.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-20">
      <div className="bg-[#0e1625] text-white rounded-xl p-6 max-w-md shadow-lg w-full">
        <h2 className="text-xl font-semibold mb-4">
          {existing ? "Update Leave" : "Add Leave"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Employee Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Employee"
              className="w-full px-4 py-2 rounded bg-[#1e293b] text-white"
              value={search || form.name}
              onChange={handleSearchChange}
              disabled={!!existing}
            />
            {search && filteredEmployees.length > 0 && (
              <div className="absolute z-10 bg-gray-800 w-full mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredEmployees.map(emp => (
                  <div
                    key={emp._id}
                    className="p-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {emp.firstName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-mono">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-gray-400">{emp.jobProfile}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="flex gap-2">
            <DatePicker
              selected={form.startDate}
              onChange={(date) => setForm({ ...form, startDate: date })}
              placeholderText="Start Date"
              className="w-full px-4 py-2 rounded bg-[#1e293b] text-white"
            />
            <DatePicker
              selected={form.endDate}
              onChange={(date) => setForm({ ...form, endDate: date })}
              placeholderText="End Date"
              className="w-full px-4 py-2 rounded bg-[#1e293b] text-white"
            />
          </div>

          {/* Remarks */}
          <textarea
            name="remarks"
            placeholder="Remarks"
            className="w-full px-4 py-2 rounded bg-[#1e293b] text-white"
            rows={3}
            value={form.remarks}
            onChange={handleChange}
          />

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white">
              {existing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeave;
