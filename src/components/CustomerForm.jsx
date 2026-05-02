import { useState } from 'react';
import { PlusCircle, RotateCcw, CalendarDays } from 'lucide-react';

export default function CustomerForm({ onSubmit, onNotify }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const emptyForm = {
    name: '',
    phone: '',
    product: '',
    amount: '',
    entryDate: todayStr
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.product.trim()) newErrors.product = 'Product name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, addAnother = false) => {
    e.preventDefault();
    if (!validate()) {
      onNotify('Please fill all required fields correctly', 'error');
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({ ...emptyForm, entryDate: formData.entryDate });
    setErrors({});

    if (!addAnother) {
      // Optionally could close/collapse form, for now just reset
    }
  };

  const inputClass = (field) =>
    `w-full p-3.5 border rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400 ${
      errors[field]
        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
        : 'border-gray-200 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-300'
    }`;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
          New Entry
        </h2>
        <button
          type="button"
          onClick={() => { setFormData(emptyForm); setErrors({}); }}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset form"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Customer Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass('name')}
              placeholder="Enter customer name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              placeholder="Enter phone number"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <CalendarDays size={14} />
              Date
            </label>
            <input
              type="date"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              className={inputClass('entryDate')}
            />
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Product Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className={inputClass('product')}
              placeholder="E.g., UltraTech Cement 50kg"
            />
            {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Amount (₹) <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={inputClass('amount')}
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-sm hover:shadow-md text-base"
          >
            <PlusCircle size={20} />
            <span>Save Entry</span>
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold py-3.5 px-8 rounded-xl transition-all text-base border border-gray-200"
          >
            <PlusCircle size={20} />
            <span>Save & Add New</span>
          </button>
        </div>
      </form>
    </div>
  );
}
