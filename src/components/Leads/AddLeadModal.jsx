import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

export default function AddLeadModal() {
  const { isAddLeadModalOpen, setIsAddLeadModalOpen, addLead, agents } = useCRM();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'MagicBricks',
    agentId: agents[0]?.id || '',
    propertyType: '3BHK',
    locality: '',
    budget: '',
    timeline: 'Immediate',
    status: 'Hot',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) newErrors.phone = 'Phone must be a 10-digit number';
    
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email address is invalid';
    if (!form.locality.trim()) newErrors.locality = 'Preferred locality is required';
    if (!form.budget) newErrors.budget = 'Budget is required';
    else if (isNaN(form.budget) || Number(form.budget) <= 0) newErrors.budget = 'Budget must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      agentId: form.agentId,
      propertyType: form.propertyType,
      locality: form.locality,
      budget: Number(form.budget),
      timeline: form.timeline,
      status: form.status,
      notes: form.notes,
      stage: 'NEW INQUIRY' // Defaults to new inquiry stage
    });

    setIsAddLeadModalOpen(false);
    
    // Clear Form
    setForm({
      name: '',
      phone: '',
      email: '',
      source: 'MagicBricks',
      agentId: agents[0]?.id || '',
      propertyType: '3BHK',
      locality: '',
      budget: '',
      timeline: 'Immediate',
      status: 'Hot',
      notes: ''
    });
  };

  return (
    <Modal
      isOpen={isAddLeadModalOpen}
      onClose={() => setIsAddLeadModalOpen(false)}
      title="Add New Lead Profile"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Two-Column Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Pintu Singha"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              error={errors.name}
            />

            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210 (10 digit)"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              required
              error={errors.phone}
            />

            <Input
              label="Email Address"
              placeholder="e.g. pintu.singha@gmail.com"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <Input
              label="Lead Source"
              type="select"
              name="source"
              value={form.source}
              onChange={handleInputChange}
              options={[
                { value: 'MagicBricks', label: 'MagicBricks' },
                { value: '99acres', label: '99acres' },
                { value: 'Walk-in', label: 'Walk-in' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'Referral', label: 'Referral' }
              ]}
            />

            <Input
              label="Assigned Agent"
              type="select"
              name="agentId"
              value={form.agentId}
              onChange={handleInputChange}
              options={agents.map(a => ({ value: a.id, label: `${a.name} (${a.role})` }))}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <Input
              label="Property Type"
              type="select"
              name="propertyType"
              value={form.propertyType}
              onChange={handleInputChange}
              options={[
                { value: '2BHK', label: '2BHK Apartment' },
                { value: '3BHK', label: '3BHK Apartment' },
                { value: 'Villa', label: 'Villa' },
                { value: 'Plot', label: 'Plot' },
                { value: 'Commercial', label: 'Commercial Space' }
              ]}
            />

            <Input
              label="Preferred Locality"
              placeholder="e.g. Whitefield, Sarjapur"
              name="locality"
              value={form.locality}
              onChange={handleInputChange}
              required
              error={errors.locality}
            />

            <Input
              label="Budget (in Rupees)"
              placeholder="e.g. 8500000 (85 Lakhs)"
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleInputChange}
              required
              error={errors.budget}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Purchase Timeline"
                type="select"
                name="timeline"
                value={form.timeline}
                onChange={handleInputChange}
                options={[
                  { value: 'Immediate', label: 'Immediate' },
                  { value: '3 months', label: '3 Months' },
                  { value: '6 months', label: '6 Months' },
                  { value: '1 year', label: '1 Year' }
                ]}
              />

              <Input
                label="Lead Status"
                type="select"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                options={[
                  { value: 'Hot', label: 'Hot 🔥' },
                  { value: 'Warm', label: 'Warm ☀️' },
                  { value: 'Cold', label: 'Cold ❄️' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Textarea Notes */}
        <Input
          label="Lead Notes & Requirement Summary"
          type="textarea"
          placeholder="Summarize his preferred layouts, high-priority amenities, downpayment constraints..."
          name="notes"
          value={form.notes}
          onChange={handleInputChange}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.04]">
          <Button variant="ghost" onClick={() => setIsAddLeadModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="cyan">
            Save Lead Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
