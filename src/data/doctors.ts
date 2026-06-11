import { Doctor } from '../types';

export const initialDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Carter',
    specialty: 'General Physician',
    phone: '9440121314',
    availability: '9:00 AM - 1:00 PM',
    clinic: 'Metro Health Care'
  },
  {
    id: 'd2',
    name: 'Dr. James Anderson',
    specialty: 'Pediatrician',
    phone: '9440556677',
    availability: '4:00 PM - 8:00 PM',
    clinic: 'Apollo Childrens Ward'
  },
  {
    id: 'd3',
    name: 'Dr. Rebecca Foster',
    specialty: 'Cardiologist',
    phone: '9880112233',
    availability: '11:00 AM - 3:00 PM',
    clinic: 'Heart Care Center'
  }
];
