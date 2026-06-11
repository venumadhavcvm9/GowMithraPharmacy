import { useState } from 'react';
import { Doctor } from '../../../types';

export function useDoctorDirectory(doctors: Doctor[], setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>) {
  const [search, setSearch] = useState('');
  
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState('');
  const [clinic, setClinic] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
    doc.clinic.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !phone) return alert('Fill in Name, Specialty, and Phone');

    const doc: Doctor = {
      id: `doc_${Date.now()}`,
      name: `Dr. ${name.replace(/^Dr\.\s+/i, '')}`,
      specialty,
      phone,
      availability: availability || 'By Appointment Only',
      clinic: clinic || 'Private Practice'
    };

    setDoctors(prev => [...prev, doc]);
    setShowAddForm(false);
    setName(''); setSpecialty(''); setPhone(''); setAvailability(''); setClinic('');
  };

  return {
    search, setSearch,
    name, setName,
    specialty, setSpecialty,
    phone, setPhone,
    availability, setAvailability,
    clinic, setClinic,
    showAddForm, setShowAddForm,
    filteredDoctors,
    handleSubmit
  };
}
