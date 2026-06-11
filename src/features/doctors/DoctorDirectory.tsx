import React from 'react';
import { Doctor } from '../../types';
import { useDoctorDirectory } from './hooks/useDoctorDirectory';
import { DirectoryList } from './components/DirectoryList';
import { AddDoctorForm } from './components/AddDoctorForm';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
}

export default function DoctorDirectory({ doctors, setDoctors }: DoctorDirectoryProps) {
  const docProps = useDoctorDirectory(doctors, setDoctors);

  return (
    <div id="doctors-directory-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <DirectoryList 
        search={docProps.search} setSearch={docProps.setSearch}
        showAddForm={docProps.showAddForm} setShowAddForm={docProps.setShowAddForm}
        filteredDoctors={docProps.filteredDoctors}
      />
      <AddDoctorForm {...docProps} />
    </div>
  );
}
